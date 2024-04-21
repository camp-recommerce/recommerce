
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ClipLoader } from "react-spinners";

const P_InfiniteComponent = () => {

const [dataSource, setDataSource] = useState(Array.from({length:20}));
const [hasMore, setHasMore] = useState(true);

const fetchMoreData= ()=> {
  if(dataSource.length <200){
  setTimeout(()=> {
    setDataSource(dataSource.concat(Array.from({length:20})))
  },500);
}else{
  setHasMore(false);
}
};

  return(
    <InfiniteScroll
      dataLength={dataSource.length}
      next={fetchMoreData}
      hasMore={hasMore} // 더 많은 항목을 가져올 수 있는지 여부를 지정합니다.
      loader={<ClipLoader color={"#123abc"} loading={true} size={150} />}
      endMessage={<p>You are all set!</p>}
      scrollableTarget="parentDiv">

      {dataSource.map((item, index) => {
        return <div key={index}>This is a div #{index + 1}</div>;
      })}
    </InfiniteScroll>
);
};

export default P_InfiniteComponent;