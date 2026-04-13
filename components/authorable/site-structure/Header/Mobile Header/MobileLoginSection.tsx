import { IHeader } from '@/.generated';
import { mobileHeaderVariants } from '@/components/authorable/site-structure/Header/Header.styles';
import RichTextWrapper from '@/helpers/Wrappers/RichTextWrapper/RichTextWrapper';
import { getCSLPAttributes } from '@/utils/type-guards';
import Link from 'next/link';

type MyAccountLogin = NonNullable<
  NonNullable<IHeader['nav_level_one']>[number]['my_account_login']
>;

type MobileLoginSectionProps = {
  myAccountLogin?: MyAccountLogin;
  showAccountLogin?: boolean;
};

const {
  loginWrapper,
  loginForm,
  loginInput,
  loginSubmitButton,
  loginFooter,
  loginForgotPasswordLink,
} = mobileHeaderVariants();

export const MobileLoginSection = ({
  showAccountLogin,
  myAccountLogin,
}: MobileLoginSectionProps) => {
  if (!showAccountLogin || !myAccountLogin) return null;

  const {
    login_form_action_url,
    username_field_placeholder,
    password_field_placeholder,
    login_button_label,
    disclaimer_note,
    signup_content,
    forgot_password_link,
    $,
  } = myAccountLogin;

  return (
    <div className={loginWrapper()}>
      <form
        id="mobile-menu-login"
        action={login_form_action_url}
        method="post"
        className={loginForm()}
      >
        <input
          type="text"
          id="txtUsernameMobile"
          name="UserName"
          placeholder={username_field_placeholder}
          autoComplete="username"
          className={loginInput()}
          {...getCSLPAttributes($?.username_field_placeholder)}
        />
        <input
          type="password"
          id="txtPasswordMobile"
          name="Password"
          placeholder={password_field_placeholder}
          autoComplete="current-password"
          className={loginInput()}
          {...getCSLPAttributes($?.password_field_placeholder)}
        />
        <input
          type="submit"
          id="submitMobile"
          value={login_button_label}
          className={loginSubmitButton()}
          {...getCSLPAttributes($?.login_button_label)}
        />
      </form>
      <RichTextWrapper
        content={disclaimer_note}
        className="headerMyLoginDisclaimerRTE"
        cslpAttribute={$?.disclaimer_note}
      />
      <div className={loginFooter()}>
        <RichTextWrapper
          content={signup_content}
          className="headerMyLoginSignupRTE"
          cslpAttribute={$?.signup_content}
        />
        <Link
          href={forgot_password_link?.href || '#'}
          className={loginForgotPasswordLink()}
          {...getCSLPAttributes($?.forgot_password_link)}
        >
          {forgot_password_link?.title}
        </Link>
      </div>
    </div>
  );
};
