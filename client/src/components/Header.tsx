import { ShoppingBag, Menu } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";

const Header = () => {
  return (
    <div>
      <div className="flex w-full justify-between p-4 relative">
        <HamburgerMenu />
        <ShoppingBag className="text-gold" />
      </div>
    </div>
  );
};
export default Header;
