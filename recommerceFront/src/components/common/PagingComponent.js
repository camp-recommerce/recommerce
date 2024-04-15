import React from "react";

const PagingComponent = ({ serverData, movePage }) => {
  // 아마 폰트설정 안가져와서 안뜨는듯?
  return (
    <div className="flex justify-center items-center">
      {serverData.prev && (
        <div
          className="mr-2 cursor-pointer"
          onClick={() => movePage({ page: serverData.prevPage })}
        >
          <span role="img" aria-label="previous-page">
            ◀
          </span>
        </div>
      )}

      {serverData.pageNumList.map((pageNum) => (
        <div
          key={pageNum}
          className={`mx-2 ${
            serverData.current === pageNum ? "font-bold" : ""
          } cursor-pointer`}
          onClick={() => movePage({ page: pageNum })}
        >
          {pageNum}
        </div>
      ))}

      {serverData.next && (
        <div
          className="ml-2 cursor-pointer"
          onClick={() => movePage({ page: serverData.nextPage })}
        >
          <span role="img" aria-label="next-page">
            ▶
          </span>
        </div>
      )}
    </div>
  );
};

export default PagingComponent;
