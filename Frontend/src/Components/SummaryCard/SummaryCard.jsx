function SummaryCard({ icon, label, value, color }) {
    const colors = {
        blue: "border-blue-500 text-blue-500",
        green: "border-green-500 text-green-500",
         orange: "border-orange-500 text-orange-500",
        indigo: "border-indigo-500 text-indigo-500",
    };

    return (
        <div
            className={`bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 border-l-4 ${colors[color]} hover:scale-105 transform transition`}
        >
            <div className={`text-3xl ${colors[color]}`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </div>
    );
}

export default SummaryCard;