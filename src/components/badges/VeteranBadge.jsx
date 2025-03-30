const VeteranBadge = ({ firstColor = "#A97142", secondColor = "#DDC6B3", className }) => (
  <svg
    className={className}
    width="176"
    height="234"
    viewBox="15 -5 176 234"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      "--first-color": firstColor,
      "--second-color": secondColor,
    }}
  >
    <g id="Veteran-Badge">
      <path id="Medal_Main-Color" d="M182 178L106 222L30 177.978V0H182V178Z" fill="var(--first-color, #A97142)" />
      <path id="Perimeter_Second-Color" fillRule="evenodd" clipRule="evenodd" d="M167 169.46V15H45V169.463L106 204.725L167 169.46ZM106 210.5L172 172.344V10H40V172.348L106 210.5Z" fill="var(--second-color, #DDC6B3)" />
      <path id="Icon_Second-Color" d="M139.25 58.75H125C125 56.1197 122.876 54 120.25 54H91.75C89.1244 54 87 56.1197 87 58.75H72.75C70.1244 58.75 68 60.8697 68 63.5V73C68 83.4928 76.5072 92 87 92C87.2232 92 87.4311 91.9394 87.6496 91.9299C89.356 98.6144 94.5751 103.843 101.25 105.573V120.5H91.75C89.1244 120.5 87 122.62 87 125.25V130H125V125.25C125 122.62 122.876 120.5 120.25 120.5H110.75V105.573C117.425 103.843 122.644 98.6156 124.35 91.9311C124.569 91.9394 124.777 92 125 92C135.493 92 144 83.4928 144 73V63.5C144 60.8697 141.876 58.75 139.25 58.75ZM77.5 73V68.25H87V82.5C81.7536 82.5 77.5 78.2416 77.5 73ZM134.5 73C134.5 78.2416 130.246 82.5 125 82.5V68.25H134.5V73Z" fill="var(--second-color, #DDC6B3)" />
      <path id="Ribbon-Left-2" d="M0 151.5L22.0153 147.282V173L29.9999 178L0.0141524 183.537L9.99987 165.5L0 151.5Z" fill="#0098FF" />
      <path id="Ribbon-Left-1" d="M29.9998 178L21.9998 173L29.9998 171.523V178Z" fill="#B8E3FF" />
      <path id="Ribbon-Right-2" d="M212 99.5L182 105L190 110V135.551L212 131.5L202 117.5L212 99.5Z" fill="#0098FF" />
      <path id="Ribbon-Right-1" d="M182 105L190 110L182 111.48L182 105Z" fill="#B8E3FF" />
      <path id="Ribbon-Center" d="M190 142L21.9998 173V141L190 110V142Z" fill="#3DB1FF" />
    </g>
  </svg>

);

export default VeteranBadge;
