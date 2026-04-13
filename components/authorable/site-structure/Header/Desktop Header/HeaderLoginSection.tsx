import { IHeader } from '@/.generated';
import { desktopHeaderVariants } from '../Header.styles';
import { getCSLPAttributes } from '@/utils/type-guards';
import RichTextWrapper from '@/helpers/Wrappers/RichTextWrapper/RichTextWrapper';
import Link from 'next/link';

type MyAccountLogin = NonNullable<
  NonNullable<IHeader['nav_level_one']>[number]['my_account_login']
>;

type HeaderLoginSectionProps = {
  myAccountLogin?: MyAccountLogin;
  showAccountLogin?: boolean;
};

export const HeaderLoginSection = ({
  myAccountLogin,
  showAccountLogin,
}: HeaderLoginSectionProps) => {
  //Return early if showAccountLogin is false or myAccountLogin is undefined
  if (!showAccountLogin || !myAccountLogin) return null;

  const {
    loginSection,
    loginContainer,
    loginGrid,
    loginFormColumn,
    loginForm,
    loginFormRow,
    loginFormLabel,
    loginUsernameInput,
    loginPasswordWrapper,
    loginPasswordInput,
    loginForgotPasswordLink,
    loginSubmitButton,
    loginSignupColumn,
    loginDisclaimerContainer,
    loginDisclaimerWrapper,
  } = desktopHeaderVariants();

  return (
    <div className={loginSection()}>
      <div className={loginContainer()}>
        <div className={loginGrid()}>
          <div className={loginFormColumn()}>
            <form
              id="menu-login"
              action={myAccountLogin.login_form_action_url}
              method="post"
              className={loginForm()}
            >
              <div className={loginFormRow()}>
                <span
                  className={loginFormLabel()}
                  {...getCSLPAttributes(myAccountLogin.$?.login_form_label)}
                >
                  {myAccountLogin.login_form_label}
                </span>
                <input
                  type="text"
                  id="txtUserName"
                  name="UserName"
                  placeholder={myAccountLogin.username_field_placeholder}
                  className={loginUsernameInput()}
                  {...getCSLPAttributes(myAccountLogin.$?.username_field_placeholder)}
                />
                <div className={loginPasswordWrapper()}>
                  <input
                    type="password"
                    id="txtPassword"
                    name="Password"
                    placeholder={myAccountLogin.password_field_placeholder}
                    className={loginPasswordInput()}
                    {...getCSLPAttributes(myAccountLogin.$?.password_field_placeholder)}
                  />
                  <Link
                    href={myAccountLogin.forgot_password_link?.href || '#'}
                    className={loginForgotPasswordLink()}
                    {...getCSLPAttributes(myAccountLogin.$?.forgot_password_link)}
                  >
                    {myAccountLogin.forgot_password_link?.title}
                  </Link>
                </div>
                <input
                  type="submit"
                  id="loginSubmit"
                  className={loginSubmitButton()}
                  value={myAccountLogin.login_button_label}
                  {...getCSLPAttributes(myAccountLogin.$?.login_button_label)}
                />
              </div>
            </form>
          </div>
          <div className={loginSignupColumn()}>
            <RichTextWrapper
              content={myAccountLogin.signup_content}
              className="headerMyLoginSignupRTE ps-3.75"
              {...getCSLPAttributes(myAccountLogin.$?.signup_content)}
            />
          </div>
        </div>
      </div>
      <div className={loginDisclaimerContainer()}>
        <div className={loginDisclaimerWrapper()}>
          <RichTextWrapper
            content={myAccountLogin.disclaimer_note}
            className="headerMyLoginDisclaimerRTE"
            {...getCSLPAttributes(myAccountLogin.$?.disclaimer_note)}
          />
        </div>
      </div>
    </div>
  );
};
