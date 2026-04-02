import Image from 'next/image'
import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        src={'/images/header/satyajan-logo.png'}
        alt='Satyajan Energy Solutions'
        width={90}
        height={82}
        unoptimized={true}
      />
    </Link>
  )
}

export default Logo