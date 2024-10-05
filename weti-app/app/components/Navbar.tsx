import { ConnectButton } from "@rainbow-me/rainbowkit"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
import { Link } from "@remix-run/react";

const Navbar = () => {
  return <NavigationMenu className="navbar">
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Wallet</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ConnectButton />
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Watch</NavigationMenuTrigger>
      <NavigationMenuContent>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <ConnectButton accountStatus={"avatar"} chainStatus={"none"} />
  </NavigationMenuList>
</NavigationMenu>
}

export default Navbar;