import { tv } from 'tailwind-variants';

export const desktopHeaderVariants = tv(
  {
    slots: {
      base: ['flex flex-col', 'w-full items-center justify-center'],
      topBar: ['w-full bg-white', 'border-b-3 border-b-primary md:border-0', 'relative z-20'],
      topBarContainer: [
        'flex justify-between items-center',
        'w-full max-w-300 mx-auto px-3.75 py-1.25 md:py-0',
      ],
      navBar: ['relative w-full bg-secondary hidden lg:block'],
      navBarContainer: ['w-full max-w-300 mx-auto px-3.75'],
      menuList: ['flex'],
      menuItem: ['grow text-white font-black'],
      menuItemTitle: [
        'block w-full text-center cursor-pointer',
        'px-2 py-[0.7rem]',
        'uppercase text-[0.938rem] leading-[1.35]',
        'hover:bg-tertiary/65',
      ],
      megaMenu: [
        'absolute top-full left-0 z-10',
        'w-full min-w-40 p-5',
        'bg-light-gray text-black',
        'border-y-[5px] border-t-tertiary border-b-secondary',
        'shadow-[0_7px_10px_2px_rgba(0,0,0,0.6)]',
        'header-animate-fade-out',
      ],
      megaMenuContainer: ['flex flex-col'],
      megaMenuGrid: ['grid grid-cols-3 w-full max-w-300 mx-auto'],
      l2Title: [
        'uppercase text-[0.938rem]! font-bold! leading-1.2! text-primary block',
        'border-b border-b-[#e2e2e2]',
        'pb-2.5 pe-10 mb-2',
      ],
      l3Title: [
        'text-[0.938rem]! font-bold! leading-1.2! text-primary block',
        'mt-6 ms-[2.4px] mb-2',
      ],
      menuLink: [
        'flex justify-start items-center gap-2.5 w-full',
        'px-2 py-1',
        'font-medium text-[0.938rem] leading-1.35 text-black',
        'hover:bg-white hover:text-secondary hover:underline',
      ],
      megaMenuColumn: ['px-3.75'],
      megaMenuColumnGroup: ['mb-6.25 last:mb-0'],
      featuredSection: ['flex items-start justify-center px-3.75 mb-5 lg:mb-0'],
      featuredImageOverlay: [
        'relative z-2 w-full h-full p-2',
        'flex flex-col items-start justify-end',
        'border',
      ],
      featuredImageContent: ['w-full p-3.75'],
      featuredContent: ['text-white font-black uppercase', 'text-[1.5rem] leading-6 mb-3'],
      featuredLink: [
        'px-3 py-1.5 bg-[#f8f9fa] text-primary hover:bg-[#e2e6ea]',
        'rounded-sm font-block text-[0.8rem] leading-normal min-h-8.75 inline-block tracking-normal',
      ],
      loginSection: ['mb-6.25 flex flex-col'],
      loginContainer: ['w-full max-w-307.5 mx-auto px-5 pt-5 bg-white'],
      loginGrid: ['grid grid-cols-12 pb-3.75'],
      loginFormColumn: ['col-span-9 px-3.75 border-e'],
      loginForm: ['py-2 pe-2'],
      loginFormRow: ['flex items-center'],
      loginFormLabel: ['text-primary text-[0.938rem] leading-1.35 font-medium'],
      loginUsernameInput: [
        'border border-[#767676] rounded-[5px]',
        'text-black text-[0.875rem] font-medium',
        'mx-1.25 px-2.5 py-0.5 h-7.5 w-[min(300px,30vw)]',
      ],
      loginPasswordWrapper: ['mx-1.25 flex flex-col relative'],
      loginPasswordInput: [
        'border border-[#767676] rounded-[5px]',
        'text-black text-[0.875rem] font-medium',
        'px-2.5 py-0.5 h-7.5 w-[min(300px,30vw)]',
      ],
      loginForgotPasswordLink: [
        'absolute -bottom-4',
        'text-[0.75rem] block text-primary leading-[1.35] font-medium underline',
      ],
      loginSubmitButton: [
        'mx-1.25 px-2 py-1 h-8.75 grow',
        'border border-[#007bff] bg-[#0186be] rounded-[3.2px]',
        'text-white font-black leading[1.5] text-[0.875rem] uppercase cursor-pointer',
      ],
      loginSignupColumn: ['col-span-3 px-3.75 flex items-center justify-start'],
      loginDisclaimerContainer: [
        'px-5 bg-[#f9f9f9] max-w-307.5 mx-auto w-full',
        'border-b-2 border-b-secondary',
      ],
      loginDisclaimerWrapper: ['mt-4 px-3.75'],
      identifierLegend: ['w-full max-w-300 mx-auto px-3.75 mt-3 flex'],
      identifierLegendItem: [
        'px-2 py-1 flex items-center',
        'font-medium leading-[1.35] text-[1rem]',
        'gap-1.25 w-fit',
      ],
      identifierIcon: ['h-3 w-auto'],
    },
    variants: {
      menuVisible: {
        true: {
          menuItemTitle: ['bg-tertiary hover:bg-tertiary'],
          megaMenu: ['block header-animate-fade-in'],
        },
        false: {
          megaMenu: ['hidden'],
        },
      },
    },
  },
  { twMerge: false }
);

export const mobileHeaderVariants = tv(
  {
    slots: {
      megaMenuContainer: [
        'w-full md:w-1/2 bg-primary',
        'absolute right-0 top-0 z-10',
        '-translate-y-full transform transition-transform duration-300 ease-in-out',
        'px-4 pb-4',
      ],
      navList: ['flex flex-col'],
      navItem: ['border-b border-b-white'],
      navItemTitle: [
        'text-white font-bold text-[0.938rem] leading-normal uppercase',
        'py-5 w-full flex items-center justify-between cursor-pointer',
      ],
      megaMenu: ['header-animate-fade-out', 'w-full bg-white mt-0.5 pt-3.75 pb-2 px-3.75'],
      topLinksList: ['mb-5'],
      topLink: [
        'flex items-center justify-start gap-2.5 w-full',
        'p-2.5 font-medium leading-normal text-black',
        'hover:text-secondary hover:underline',
      ],
      levelTwoList: ['flex flex-col mb-5'],
      levelTwoTitle: [
        'text-primary font-medium leading-normal uppercase',
        'pt-2 pb-2.5 w-full flex items-center justify-between',
        'border-b border-b-[#e2e2e2] cursor-pointer',
      ],
      subMegaMenu: ['header-animate-fade-out', 'w-full bg-white mt-0.5 py-2'],
      levelTwoLink: [
        'flex justify-start items-center gap-2.5',
        'p-2.5 font-medium leading-normal',
        'hover:text-secondary',
      ],
      levelThreeTitle: ['text-primary font-bold leading-[1.2]', 'mb-2 inline-block w-full'],
      levelThreeLink: [
        'flex justify-start items-center gap-2.5',
        'p-2.5 font-medium leading-normal',
        'hover:text-secondary',
      ],
      chevronIconL1: ['text-white shrink-0', 'transition-transform duration-250 ease-linear'],
      chevronIconL2: ['text-gray-600 shrink-0', 'transition-transform duration-250 ease-linear'],
      loginWrapper: ['flex flex-col gap-4'],
      loginForm: ['flex flex-col'],
      loginInput: [
        'border border-[#767676] rounded-[5px]',
        'text-black text-[16px] font-medium',
        'ps-2.5 py-0.5 pe-0.5 h-7.5 w-full my-1.5',
      ],
      loginSubmitButton: [
        'border border-[#007bff] bg-[#0186be] rounded-[3.2px]',
        'text-white font-black leading-normal text-[0.875rem] uppercase cursor-pointer',
        'px-2 py-1 w-fit my-1.5',
      ],
      loginFooter: ['flex justify-between items-center border-b-4 border-b-[#d7d7d7]'],
      loginForgotPasswordLink: ['py-3.75 font-bold text-[0.875rem] hover:underline text-primary'],
    },
    variants: {
      mobileMenuOpen: {
        true: {
          megaMenuContainer: ['translate-y-0 top-20 md:top-17.5'],
        },
      },
      megaMenuVisible: {
        true: {
          megaMenu: ['block header-animate-fade-in'],
          chevronIconL1: ['rotate-180'],
        },
        false: {
          megaMenu: ['hidden'],
        },
      },
      subMegaMenuVisible: {
        true: {
          subMegaMenu: ['block header-animate-fade-in'],
          chevronIconL2: ['rotate-180'],
        },
        false: {
          subMegaMenu: ['hidden'],
        },
      },
    },
  },
  { twMerge: false }
);
