import { NavLinks } from '@/types/navlink'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  item: NavLinks;
  onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ item, onClick }) => {
  const path = usePathname()
  const itemLabelToPath = `/${item.label.toLowerCase().replace(/\s+/g, '-')}`

  const isActive =
    item.href === path ||
    (item.href !== '/' && path.startsWith(itemLabelToPath))

  const linkClasses = clsx(
    'block py-2 text-2xl sm:text-3xl md:text-4xl font-medium transition-colors',
    isActive
      ? 'text-primary'
      : 'text-white/55 hover:text-white'
  )

  return (
    <li className="flex items-center gap-3 group">
      <span
        className={clsx(
          'h-0.5 bg-primary transition-all duration-300',
          isActive ? 'w-6' : 'w-0 group-hover:w-6'
        )}
      />
      <Link href={item.href} className={linkClasses} onClick={onClick}>
        {item.label}
      </Link>
    </li>
  )
}

export default NavLink
