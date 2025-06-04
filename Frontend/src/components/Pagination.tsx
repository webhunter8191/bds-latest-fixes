// export type Props = {
//   page: number;
//   pages: number;
//   onPageChange: (page: number) => void;
// };

// const Pagination = ({ page, pages, onPageChange }: Props) => {
//   const pageNumbers = [];
//   for (let i = 1; i <= pages; i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <div className="flex justify-center">
//       <ul className="flex border border-slate-300">
//         {pageNumbers.map((number) => (
//           <li className={`px-2 py-1 ${page === number ? "bg-gray-200" : ""}`}>
//             <button onClick={() => onPageChange(number)}>{number}</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Pagination;

export type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, pages, onPageChange }: Props) => {
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4">
      <ul className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 shadow-sm bg-white">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
                page === number
                  ? "bg-brand text-white font-semibold"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
              aria-label={`Go to page ${number}`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
