import CartIcon from "./CartIcon";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="fixed w-screen z-50">
      <div className="flex w-full justify-between p-4 px-10">
        <div className="w-10 h-10 relative">
          <Link href="/">
            <Image
              src={"/favicon.png"}
              alt="Logo"
              fill
              className="object-contain"
            />
          </Link>
        </div>
        <CartIcon />
      </div>
    </div>
  );
};
export default Header;
