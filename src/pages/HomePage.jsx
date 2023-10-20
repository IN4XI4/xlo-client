import React from 'react'
import { Login } from '../components/Login'

export function HomePage() {
  return (
    <div className="grid grid-cols-2 pt-28 lg:px-40 md:px-20">
      <div className='col-span-2 md:col-auto'>
        <div className="text-6xl font-bold pb-4">
          Welcome to Mixelo Forum
        </div>
        <div className="text-xl pb-6">
          “This text spot explain what ‘Mixelo Forum’ stand for...”
        </div>
        <div className="text-xl inline-flex items-center cursor-pointer pb-4">
          <span className="text-[#3DB1FF] pr-3">
            Read more about the Mixelo project
          </span>
          <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.4184 6.9451C15.4996 6.73241 15.5208 6.49836 15.4794 6.27258C15.438 6.04679 15.3359 5.83941 15.1859 5.67668L10.8999 1.02192C10.8011 0.910773 10.6829 0.822121 10.5521 0.761133C10.4214 0.700145 10.2808 0.668043 10.1385 0.6667C9.99627 0.665358 9.85517 0.694801 9.72349 0.753312C9.59181 0.811824 9.47217 0.898231 9.37157 1.00749C9.27096 1.11676 9.1914 1.24668 9.13752 1.3897C9.08365 1.53271 9.05654 1.68594 9.05777 1.84046C9.05901 1.99497 9.08857 2.14767 9.14472 2.28965C9.20088 2.43162 9.28251 2.56003 9.38485 2.66738L11.8429 5.33688H1.5715C1.28732 5.33688 1.01478 5.45948 0.813834 5.67772C0.61289 5.89595 0.5 6.19194 0.5 6.50057C0.5 6.8092 0.61289 7.10519 0.813834 7.32342C1.01478 7.54166 1.28732 7.66426 1.5715 7.66426H11.8429L9.38592 10.3326C9.28358 10.44 9.20195 10.5684 9.14579 10.7103C9.08964 10.8523 9.06008 11.005 9.05884 11.1595C9.05761 11.314 9.08472 11.4673 9.13859 11.6103C9.19247 11.7533 9.27203 11.8832 9.37264 11.9925C9.47324 12.1017 9.59288 12.1882 9.72456 12.2467C9.85624 12.3052 9.99734 12.3346 10.1396 12.3333C10.2819 12.3319 10.4225 12.2998 10.5532 12.2388C10.6839 12.1779 10.8022 12.0892 10.901 11.9781L15.187 7.3233C15.2863 7.21496 15.3649 7.08645 15.4184 6.9451Z" fill="#3DB1FF" />
          </svg>
        </div>
        <div>
          <svg width="171" height="171" viewBox="0 0 171 171" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 md:w-32 lg:w-36 h-28 md:h-32 lg:h-36">
            <circle cx="85.5" cy="85.5" r="85.5" fill="#3DB1FF" />
            <path d="M31.0142 105.52C31.0142 105.52 29.9801 108.69 26.2446 108.351C22.5091 108.011 21.3227 102.981 21.1303 101.542C20.9379 100.103 20.5371 96.197 23.1263 84.5852C25.7235 72.941 30.1645 61.9518 30.1645 61.9518C30.1645 61.9518 30.7977 59.995 33.0503 59.9303C34.7818 59.8818 35.6235 60.2295 35.6555 61.9842C35.6876 63.7389 34.5653 83.445 38.7017 84.6822C42.838 85.9194 48.4253 66.2375 48.4253 66.2375C48.4253 66.2375 49.1627 63.1324 51.4313 63.1486C52.5776 63.1567 52.8341 63.3427 53.0586 63.7146C53.3472 64.1998 53.2029 65.0569 52.6898 67.8467C51.4874 74.3561 50.1728 89.8493 51.2069 98.736C52.2329 107.623 56.5697 108.989 56.5697 108.989C56.5697 108.989 55.247 114.189 50.1247 112.28C44.0003 109.992 44.85 100.256 44.9062 98.7118C44.9543 97.4422 46.0445 82.7819 48.1848 74.0326C48.1848 74.0326 42.7578 91.507 36.7778 89.7765C30.7977 88.0461 31.2948 69.5933 31.2948 69.5933C31.2948 69.5933 27.936 82.7172 27.5031 96.0272C27.2386 104.267 31.0222 105.504 31.0222 105.504L31.0142 105.52Z" fill="white" />
            <path d="M58.4374 79.2564C57.8041 77.6877 58.742 75.8198 60.5376 75.0839C62.3252 74.3481 64.2972 75.0192 64.9305 76.5799C65.5637 78.1486 64.6258 80.0165 62.8302 80.7524C61.0426 81.4882 59.0787 80.8171 58.4374 79.2564Z" fill="white" />
            <path d="M69.5397 106.935C69.5397 106.935 68.7701 110.526 66.1008 110.526C63.4314 110.526 60.9624 108.706 59.8963 105.31C59.4153 103.79 58.9343 102.108 58.6618 95.7441C58.4133 89.9867 58.8943 85.8385 58.9985 85.4342C59.2069 84.666 60.0165 84.1161 61.5075 84.1323C62.9985 84.1566 63.9524 84.4638 63.8081 86.6633C63.3833 92.8331 63.3833 94.7172 64.1448 99.5932C65.1709 106.111 69.5397 106.935 69.5397 106.935Z" fill="white" />
            <path d="M121.124 58.685C120.322 58.6689 118.783 58.8629 118.47 60.0193C118.053 61.5476 112.779 85.3696 115.697 95.2024C117.075 99.852 119.4 101.785 121.348 101.865C123.641 101.954 125.468 99.6498 125.541 99.011C125.541 99.011 121.516 97.9598 120.49 90.3668C119.472 82.782 120.699 75.9006 123.496 60.2295C123.753 58.7982 121.917 58.7012 121.116 58.685H121.124Z" fill="white" />
            <path d="M109.356 95.0732C107.705 95.0085 106.871 96.2295 106.871 96.2295C106.871 96.2295 107.6 98.251 106.582 100.014C105.556 101.777 104.466 102.068 103.44 102.141C102.382 102.205 98.8066 101.3 99.2555 93.7874C99.2555 93.7874 104.394 96.1971 108.843 92.2915C113.3 88.3778 110.879 82.8225 110.879 82.8225C110.879 82.8225 109.356 78.7875 104.049 78.8765C104.049 78.8765 96.4499 78.3832 94.2615 88.1999C92.065 98.0084 98.2375 102.763 98.2375 102.763C98.2375 102.763 102.141 105.844 106.975 103.742C112.017 101.542 111.208 97.1756 111.151 96.8521C111.087 96.4559 110.775 95.1298 109.356 95.0732ZM100.859 83.7524C101.524 82.402 102.51 81.2538 103.881 81.2538C105.139 81.2538 105.893 82.5799 106.109 83.7039C106.318 84.8279 106.35 87.2457 105.091 89.3562C103.047 92.995 99.2555 91.2646 99.2555 91.2646C99.1273 88.96 100.185 85.1109 100.859 83.7524Z" fill="white" />
            <path d="M149.645 76.3857C149.541 75.8925 149.268 75.4558 149.02 75.5933C148.755 75.7388 146.631 79.976 142.944 79.9841C142.88 79.8224 142.807 79.6687 142.727 79.5232C141.004 76.1917 138.743 74.8736 136.282 74.8736C133.549 74.8736 128.843 76.5475 126.695 82.5879C123.865 90.4315 127.16 95.4449 127.16 95.4449C127.16 95.4449 129.044 99.2859 133.565 99.5932C138.086 99.9085 142.03 96.3425 143.16 92.2024C143.874 89.5986 144.218 86.0488 143.761 83.0164C149.677 81.8439 149.781 77.0245 149.645 76.3857ZM134.92 79.8062C135.376 80.4854 137.236 82.879 140.876 83.1943C141.22 86.1943 140.932 90.1566 140.314 91.7415C139.489 93.8439 137.99 96.0676 135.497 95.6794C132.996 95.2913 131.465 91.8951 131.873 87.6417C132.282 83.3884 133.212 81.7145 133.733 80.9787C133.974 80.6472 134.342 80.1782 134.92 79.8062Z" fill="white" />
            <path d="M87.7685 106.742C84.578 106.378 81.4117 103.111 78.7423 99.2134C76.3455 104.34 79.2072 107.615 79.2072 107.615C79.2072 107.615 74.4537 111.488 72.3614 105.99C71.2151 102.974 73.0669 98.4938 75.7122 94.2161C73.139 89.5261 71.4636 85.2404 71.3835 84.917C71.1991 84.1892 73.0348 83.1299 73.0348 83.1299C73.0348 83.1299 75.2553 81.5936 76.0008 83.6717C76.7944 85.8954 77.6842 87.917 78.7022 89.8334C81.9007 85.5154 85.1151 82.1515 85.3717 81.9332C85.9729 81.4318 87.7925 82.4992 87.7925 82.4992C87.7925 82.4992 90.2294 83.6636 88.6182 85.2566C85.6602 88.2 83.3756 91.0949 81.4117 94.3051C82.2854 95.5908 83.2554 96.8603 84.2975 98.138C88.0009 102.666 92.506 101.696 92.506 101.696C92.506 101.696 93.9008 107.453 87.7765 106.75L87.7685 106.742Z" fill="white" />
          </svg>
        </div>
      </div>
      <div className='col-span-2 md:col-auto'>
        <Login />
      </div>

    </div>
  )
}
