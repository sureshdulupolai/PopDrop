import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import privateApi from "../../api/axiosPrivate";
import AuthErrorScreen from "../common/AuthErrorScreen";

const DeleteConfirmation = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);

    // 🔒 Verify Ownership on Mount
    useEffect(() => {
        const verifyOwnership = async () => {
            try {
                const res = await privateApi.get(`/pop/posts/${slug}/`);
                if (!res.data.is_owner) {
                    navigate("/templates/gallery", { replace: true });
                }
            } catch (error) {
                navigate("/templates/gallery", { replace: true });
            } finally {
                setVerifying(false);
            }
        };
        verifyOwnership();
    }, [slug, navigate]);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await privateApi.delete(`/pop/posts/${slug}/delete/`);
            // Redirect to gallery or my templates
            navigate("/templates/gallery", { replace: true });
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete template. Please try again.");
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(`/template/${slug}`);
    };

    if (verifying) return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;

    return (
        <div className="delete-confirm-wrapper">
            <div className="delete-card">
                <i className="bi bi-exclamation-triangle-fill warning-icon"></i>
                <h2>Delete Template?</h2>
                <p>
                    Are you sure you want to delete this template?
                    <br />
                    <strong>This action cannot be undone.</strong>
                </p>

                <div className="action-buttons">
                    <button
                        className="cancel-btn"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="delete-btn"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Yes, Delete It"}
                    </button>
                </div>
            </div>

            <style>{`
                .delete-confirm-wrapper {
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8fafc;
                    padding: 20px;
                }

                .delete-card {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    text-align: center;
                    max-width: 450px;
                    width: 100%;
                    border: 1px solid #e2e8f0;
                }

                .warning-icon {
                    font-size: 48px;
                    color: #ef4444;
                    margin-bottom: 20px;
                    display: block;
                }

                .delete-card h2 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    color: #1e293b;
                }

                .delete-card p {
                    color: #64748b;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }

                .action-buttons {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }

                .cancel-btn {
                    padding: 12px 24px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #475569;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .cancel-btn:hover {
                    background: #f1f5f9;
                }

                .delete-btn {
                    padding: 12px 24px;
                    border-radius: 12px;
                    border: none;
                    background: #ef4444;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }

                .delete-btn:hover {
                    background: #dc2626;
                    transform: translateY(-2px);
                }

                .delete-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default DeleteConfirmation;
