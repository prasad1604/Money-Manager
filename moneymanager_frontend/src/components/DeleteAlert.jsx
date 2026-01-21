import { LoaderCircle } from "lucide-react";
import { useState } from "react";

const DeleteAlert = ({content, onDelete}) => {

    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try{
            await onDelete();
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div>
            <p className="text-sm">{content}</p>
            <div className="flex justify-end mt-6">
                <button
                onClick={handleDelete}
                disabled={loading}
                type="button" 
                className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded-lg transition">
                    {loading ? (
                        <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Deleting...
                        </>
                    ) : (
                        <>
                        Delate
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default DeleteAlert;