import React from "react";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

// 임시 dummyList 생성
const dummyList = new Array(1000).fill(0).map((_, idx) => ({
  id: idx,
  name: `List ${idx}`,
}));

const P_InfiniteComponent = () => (
  <div
    className="ListContainer"
    style={{ width: "100%", height: "100vh", overflow: "hidden" }}
  >
    {" "}
    {/* AutoSizer가 전체 화면을 사용하도록 설정 */}
    <AutoSizer>
      {({ width, height }) => (
        <List
          height={height}
          width={width}
          itemCount={dummyList.length}
          itemSize={() => 50}
        >
          {({ index, style }) => (
            <div style={style}>{dummyList[index].name}</div>
          )}
        </List>
      )}
    </AutoSizer>
  </div>
);

export default P_InfiniteComponent;
