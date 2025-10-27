
const IconButton = ({ icon: Icon, onClick, bg = "bg-blue-100", hover = "hover:bg-blue-200", color = "text-blue-600", title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${bg} ${hover} transition`}
  >
    <Icon className={`${color} w-5 h-5`} />
  </button>
);

export default IconButton;
