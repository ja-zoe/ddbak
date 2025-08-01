import HamburgerMenu from "./HamburgerMenu";
import CartIcon from "./CartIcon";
import Image from "next/image";

const Header = () => {
  return (
    <div>
      <div className="flex w-full justify-between p-4 relative">
        <div className="w-10 h-10 relative">
          <a href="/">
            <Image
              src={"/favicon.png"}
              alt="Logo"
              fill
              className="object-contain"
            />
          </a>
        </div>
        <CartIcon />
      </div>
    </div>
  );
};
export default Header;
