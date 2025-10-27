const StatsCards = ({ stats, onClick }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
    {
      stats.map((stat, idx) => (
        <div
          key={idx}
          onClick={() => onClick(stat.type)}
          className={`cursor-pointer ${stat.bg} ${stat.text} p-5 rounded-xl shadow-md hover:shadow-lg transition`}
        >
          <h2 className="text-sm opacity-90 font-medium">{stat.label}</h2>
          <p className="text-3xl font-bold mt-1">{stat.value}</p>
        </div>
      ))
    }
  </div>
);

export default StatsCards;
