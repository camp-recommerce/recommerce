import React, { useState, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

const LOADING = 1;
const LOADED = 2;
let itemStatusMap = {};

// 아이템이 로드되었는지 확인하는 함수
const isItemLoaded = (index) => !!itemStatusMap[index];

// 실제 데이터를 로드하는 함수 (여기서는 시뮬레이션으로 처리)
const loadMoreItems = (startIndex, stopIndex) => {
  for (let index = startIndex; index <= stopIndex; index++) {
    itemStatusMap[index] = LOADING;
  }
  return new Promise((resolve) =>
    setTimeout(() => {
      for (let index = startIndex; index <= stopIndex; index++) {
        itemStatusMap[index] = LOADED;
      }
      resolve();
    }, 2500)
  );
};

function Row({ index, style }) {
  let label;
  if (itemStatusMap[index] === LOADED) {
    label = `Row ${index}`;
  } else {
    label = "Loading...";
  }
  return (
    <div className="ListItem" style={style}>
      {label}
    </div>
  );
}

export default function InfiniteComponent() {
  const [itemCount, setItemCount] = useState(1000); // 예시로 1000개의 아이템을 가정

  return (
    <div
      className="infinite flex items-center"
      style={{ width: "100%", height: "auto" }}
    >
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <List
            className="List"
            height={150}
            itemCount={itemCount}
            itemSize={30}
            onItemsRendered={onItemsRendered}
            ref={ref}
            width={1000}
          >
            {Row}
          </List>
        )}
      </InfiniteLoader>
    </div>
  );
}
