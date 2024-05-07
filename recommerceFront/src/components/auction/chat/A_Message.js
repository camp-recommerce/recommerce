import React, { useEffect, useState } from "react";

export const A_Message = (props) => {
  const messageContent = props.messageContent;
  const username = props.author;
  const [who, setWho] = useState("me");

  useEffect(() => {
    username === messageContent.author ? setWho("me") : setWho("other");
  }, [props]);

  return (
    <div
      // 도대체 왜 그러는지 모르걨는대 justfy-end 로 수정하니까 됩니다. 원래는, end,start만 있엇습니다
      className={`flex ${who === "me" ? "justify-end" : "justify-start"} px-10`}
    >
      {/* 채팅 메시지 내용 */}
      <div>
        {/* 메시지 */}
        <div
          className={`min-h-1 max-w-550 rounded-md text-white flex items-center m-1.5 p-2 overflow-wrap break-word word-break-all ${
            who === "me"
              ? "justify-end bg-blue-500"
              : "justify-start bg-blue-700"
          }`}
          style={{ height: "35px" }}
        >
          <p className="m-5">{messageContent.message}</p>
        </div>

        {/* 작성자와 시간 */}
        <div
          className={`flex text-sm ${
            who === "me" ? "justify-end mr-10" : "justify-start ml-10"
          }`}
        >
          <p className="m-1 text-black">{messageContent.time}</p>
          <p className="m-1 font-bold text-black">{messageContent.author}</p>
        </div>
      </div>
    </div>
  );
};
