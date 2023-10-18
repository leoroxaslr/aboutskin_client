const Pagination = ({ pageCount, page, onChange }) => {
  return (
    <ul className="flex space-x-2">
      {Array.from({ length: pageCount }, (_, index) => (
        <li key={index}>
          <button
            className={`${
              page === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            } px-3 py-1 rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none`}
            onClick={() => onChange(index + 1)}
          >
            {index + 1}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Pagination;
