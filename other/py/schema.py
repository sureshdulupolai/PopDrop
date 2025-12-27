import json

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
        else:
            return "UNKNOWN"

    def _list_schema(self, value):
        if not value:
            return []
        return [self.detect_type(value[0])]

    def _dict_schema(self, obj):
        schema = {}
        for key, value in obj.items():
            schema[key] = self.detect_type(value)
        return schema

    def generate(self, data):
        if isinstance(data, list) and data:
            schema = self._dict_schema(data[0])
        elif isinstance(data, dict):
            schema = self._dict_schema(data)
        else:
            schema = {}

        # 🔥 RETURN BEAUTIFUL JSON STRING
        return json.dumps(schema, indent=2, ensure_ascii=False)
