import { Activity } from "../utils/interfaces";

function ProgressModal({ activities }: { activities: Activity[] }) {
  return (
    <>
      <header className="bg-1 p-2 max-w-md rounded-t-md lg:max-w-lg flex justify-between">
        <h3 className="mb-0 text-white text-base flex justify-center items-center p-2">
          Progreso de actividad
        </h3>

        <div className="max-h-[40px] flex items-center cursor-pointer">
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                fill="#fff"
              ></path>{" "}
            </g>
          </svg>
        </div>
        
      </header>

      <div className="rounded-b-md max-w-md px-4 py-4 border-x-2 border-b-2 lg:max-w-lg">
        {activities.map((activity: Activity) => {
          return (
            <div
              key={activity.id}
              className="py-2 px-1 flex items-center justify-between gap-6"
            >
              <span className="max-w-[150px] text-sm text-black">
                {activity.title}
              </span>
              <progress
                className="w-5 h-6 border-4 border-gray-400 rounded-xl"
                max="100"
                value="70"
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ProgressModal;
