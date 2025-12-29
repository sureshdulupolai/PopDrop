import json
from typing import Any, Union, List


class SchemaGenerator:

    def detect_type(self, value):
        if isinstance(value, bool):
            return "BOOL"
        elif isinstance(value, int):
            return "INT"
        elif isinstance(value, float):
            return "FLOAT"
        elif isinstance(value, str):
            return "STR"
        elif isinstance(value, list):
            return self._list_schema(value)
        elif isinstance(value, dict):
            return self._dict_schema(value)
        return "UNKNOWN"

    def _list_schema(self, value):
        if not value:
            return []
        return [self.detect_type(value[0])]

    def _dict_schema(self, obj):
        return {key: self.detect_type(value) for key, value in obj.items()}

    def generate(self, data):
        if isinstance(data, list) and data:
            schema = self._dict_schema(data[0])
        elif isinstance(data, dict):
            schema = self._dict_schema(data)
        else:
            schema = {}

        return SchemaResult(schema)


class SchemaResult:
    def __init__(self, schema: dict):
        self.schema = schema

    def __repr__(self):
        return json.dumps(self.schema, indent=2, ensure_ascii=False)

    def _flatten_keys(self, obj, parent=""):
        keys = []
        for k, v in obj.items():
            full_key = f"{parent}.{k}" if parent else k
            keys.append(full_key)
            if isinstance(v, dict):
                keys.extend(self._flatten_keys(v, full_key))
        return keys

    def findByFieldName(
        self,
        fields: Union[str, list, tuple, set],
        check: bool = True
    ):
        """
        check=True  -> case sensitive
        check=False -> case insensitive
        """

        if isinstance(fields, (str,)):
            fields = [fields]

        schema_keys = self._flatten_keys(self.schema)

        if not check:
            schema_keys_lower = [k.lower() for k in schema_keys]

        result = []

        for field in fields:
            if check:
                found = field in schema_keys
            else:
                found = field.lower() in schema_keys_lower
            result.append(found)

        return result if len(result) > 1 else result[0]

class APIManagement:
    def __init__(self):
        self.schema_generator = SchemaGenerator()

    def schema_generate(self, data):
        return self.schema_generator.generate(data)

if __name__ == "__main__":

    API = APIManagement()

    sample_data = {
        "id": 1,
        "name": "Suresh",
        "email": "test@gmail.com",
        "profile": {
            "age": 22,
            "city": "Delhi"
        }
    }

    schema = API.schema_generate(sample_data)

    print("SCHEMA:\n", schema)

    print("\n--- FIND TESTS ---")
    print(schema.findByFieldName("email"))                 # True
    print(schema.findByFieldName("Email"))                 # False
    print(schema.findByFieldName("Email", check=False))    # True
    print(schema.findByFieldName(["name", "gmail"]))       # [True, False]
    print(schema.findByFieldName(["city", "country"]))     # [True, False]
