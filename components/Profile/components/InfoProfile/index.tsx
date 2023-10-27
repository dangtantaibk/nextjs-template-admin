import React from "react";

const InfoProfile = () => {
  return (
    <React.Fragment>
      <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
        <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
          <span className="font-semibold text-black dark:text-white">
            259
          </span>
          <span className="text-sm">Posts</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
          <span className="font-semibold text-black dark:text-white">
            129K
          </span>
          <span className="text-sm">Followers</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
          <span className="font-semibold text-black dark:text-white">
            2K
          </span>
          <span className="text-sm">Following</span>
        </div>
      </div>
      <div className="mx-auto max-w-180">
        <h4 className="font-semibold text-black dark:text-white">
          About Me
        </h4>
        <p className="mt-4.5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Pellentesque posuere fermentum urna, eu condimentum mauris
          tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus
          ultricies. Sed vel aliquet libero. Nunc a augue fermentum,
          pharetra ligula sed, aliquam lacus.
        </p>
      </div>
    </React.Fragment>
  );
};

export default InfoProfile;
