import localFont from 'next/font/local'

export const srpSans = localFont({
    src: [
        {
            path: '../public/fonts/SRPsans Font/SRPsans-Light.woff2',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../public/fonts/SRPsans Font/SRPsans-LightItalic.woff2',
            weight: '300',
            style: 'italic',
        },
        {
            path: '../public/fonts/SRPsans Font/SRPsans-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/SRPsans Font/SRPsans-Italic.woff2',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../public/fonts/SRPsans Font/SRPsans-Medium.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../public/fonts/SRPsans Font/SRPsans-MediumItalic.woff2',
            weight: '500',
            style: 'italic',
        },
        {
            path: '../public/fonts/SRPsans Font/SRPsans-SemiBold.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../public/fonts/SRPsans Font/SRPsans-SemiBoldItalic.woff2',
            weight: '600',
            style: 'italic',
        },
        {
            path: '../public/fonts/SRPsans Font/SRPsans-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../public/fonts/SRPsans Font/SRPsans-BoldItalic.woff2',
            weight: '700',
            style: 'italic',
        },
        {
            path: '../public/fonts/SRPsans Font/SRPsans-ExtraBold.woff2',
            weight: '800',
            style: 'normal',
        },
        {
            path: '../public/fonts/SRPsans Font/SRPsans-Black.woff2',
            weight: '900',
            style: 'normal',
        },
    ],
    variable: '--font-srpsans',
    display: 'swap',
    fallback: ['helvetica', 'arial', 'sans-serif']
})

export const srpEffra = localFont({
    src: [
        {
            path: '../public/fonts/SRP_Fonts_Effra/Effra_Std_Lt.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../public/fonts/SRP_Fonts_Effra/Effra_Std_LtIt.ttf',
            weight: '300',
            style: 'italic',
        },
        {
            path: '../public/fonts/SRP_Fonts_Effra/Effra_Std_Rg.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/SRP_Fonts_Effra/Effra_Std_It.ttf',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../public/fonts/SRP_Fonts_Effra/Effra_Std_Md.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../public/fonts/SRP_Fonts_Effra/Effra_Std_MdIt.ttf',
            weight: '500',
            style: 'italic',
        },
        {
            path: '../public/fonts/SRP_Fonts_Effra/Effra_Std_Bd.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../public/fonts/SRP_Fonts_Effra/Effra_Std_BdIt.ttf',
            weight: '700',
            style: 'italic',
        },
        {
            path: '../public/fonts/SRP_Fonts_Effra/Effra_Std_He.ttf',
            weight: '900',
            style: 'normal',
        },
        {
            path: '../public/fonts/SRP_Fonts_Effra/Effra_Std_HeIt.ttf',
            weight: '900',
            style: 'italic',
        }
    ],
    variable: '--font-srpeffra',
    display: 'swap',
})
