import { useParams } from "react-router-dom";

const Chatpage = () => {
  const { appointmentId } = useParams(); // ✅ correctly matches route

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-3xl font-bold text-purple-700 mb-4">Chat Page</h2>
      <p className="text-gray-700 mb-6">
        Chat for appointment ID: <span className="font-mono">{appointmentId}</span>
      </p>
      <div className="border rounded p-4 h-64 overflow-y-auto mb-4">
        <p className="text-gray-500">[Chat messages would appear here]</p>
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
      />
    </div>
  );
};

export default Chatpage;
