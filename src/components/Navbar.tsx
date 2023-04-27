import { useState } from 'react';
import { createStyles, Navbar, Group, Code, getStylesRef, rem, Title } from '@mantine/core';
import {
    IconCalculator,
    IconFingerprint,
    IconKey,
    IconSettings,
    Icon2fa,
    IconDatabaseImport,
    IconReceipt2,
    IconSwitchHorizontal,
    IconLogout,
    IconUserCircle,
} from '@tabler/icons-react';
import { signOut } from 'next-auth/react';

const useStyles = createStyles((theme) => ({
    navbar: {
        backgroundColor: theme.fn.variant({ variant: 'filled', color: "green.9" }).background,
    },

    version: {
        backgroundColor: theme.fn.lighten(
            theme.fn.variant({ variant: 'filled', color: "green.9" }).background!,
            0.1
        ),
        color: theme.white,
        fontWeight: 700,
    },

    header: {
        paddingBottom: theme.spacing.md,
        marginBottom: `calc(${theme.spacing.md} * 1.5)`,
        borderBottom: `${rem(1)} solid ${theme.fn.lighten(
            theme.fn.variant({ variant: 'filled', color: "green.9" }).background!,
            0.1
        )}`,
    },

    footer: {
        paddingTop: theme.spacing.md,
        marginTop: theme.spacing.md,
        borderTop: `${rem(1)} solid ${theme.fn.lighten(
            theme.fn.variant({ variant: 'filled', color: "green.9" }).background!,
            0.1
        )}`,
    },

    link: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.white,
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.fn.lighten(
            theme.fn.variant({ variant: 'filled', color: "green.9" }).background!,
            0.1
            ),
        },
    },

    linkIcon: {
        ref: getStylesRef('icon'),
        color: theme.white,
        opacity: 0.75,
        marginRight: theme.spacing.sm,
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.lighten(
            theme.fn.variant({ variant: 'filled', color: "green.9" }).background!,
            0.15
            ),
            [`& .${getStylesRef('icon')}`]: {
            opacity: 0.9,
            },
        },
    },
}));

export function Comp_Navbar({page, username, storeName}:{page: string, username?:string, storeName?: string}) {
    const { classes, cx } = useStyles();
    const [active, setActive] = useState(page);

    const data = [
        { link: '', label: '会計', icon: IconCalculator },
        { link: '', label: '売上確認', icon: IconReceipt2 },
    ];
    
    const links = data.map((item) => (
    <a
        className={cx(classes.link, { [classes.linkActive]: item.label === active })}
        href={item.link}
        key={item.label}
        onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        }}
    >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
    </a>
    ));

    return (
        <Navbar width={{ sm: 300 }} p="md" className={classes.navbar}>
            <Navbar.Section grow>
            <Group className={classes.header} position="apart">
                <Title order={4} color='#fff'>{storeName || "HFHS REGISYS"}</Title>
            </Group>
            {links}
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <div className={classes.link}>
                    <IconUserCircle className={classes.linkIcon} stroke={1.5} />
                    <span>{username}</span>
                </div>
                <a href="#" className={classes.link} onClick={() => signOut()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>ログアウト</span>
                </a>
            </Navbar.Section>
        </Navbar>
    );
}