export const Delete: React.FC<React.SVGProps<SVGSVGElement> & { className?: string }> = (props) => {
  return (
    <svg
      height={30}
      width={18}
      viewBox="0 0 10 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.66665 4V10.6667H2.33331V4H7.66665ZM6.66665 0H3.33331L2.66665 0.666667H0.333313V2H9.66665V0.666667H7.33331L6.66665 0ZM8.99998 2.66667H0.99998V10.6667C0.99998 11.4 1.59998 12 2.33331 12H7.66665C8.39998 12 8.99998 11.4 8.99998 10.6667V2.66667Z"
        fill="currentColor"
      />
    </svg>
  );
};
