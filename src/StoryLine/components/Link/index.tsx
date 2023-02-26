/** @format */

import { forwardRef } from 'react'

import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'

/**
 * @class Link
 * @description Maps MUI <Link /> to react-router <Link />
 * @category UI
 * @subcategory Components
 * @return {RouterLink}
 */
const Link = forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
    const { href, ...other } = props
    return <RouterLink ref={ref} to={href} {...other} />
})

export default Link
