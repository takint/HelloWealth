import { useContext, useState } from 'react'
import { Formik } from 'formik'
import { Form } from 'reactstrap'
import { Link } from 'react-router-dom'
import { ErrorMsg, FormGroup, FormInput } from '../styles/global.styles'
import { login } from '../services/api'
import { dynamicValidation } from '../services/helper'
import { UserContext } from '../services/context'

export const LoginPage = ({ pageHeader, errorMessage }) => {
  const userContext = useContext(UserContext)
  const [isFormSubmit, setFormSubmit] = useState()
  const [loginError, setLoginError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const schema = dynamicValidation([
    { name: 'email', required: true, type: 'text', label: 'Email' },
    { name: 'password', required: true, label: 'Password' },
  ])

  // const logoutHandle = async () => {
  //   const response = await logout()
  //   if (!response.error) {
  //     //removeCookie(JWT_COOKIE_DASHBOARD)
  //     userContext.setContext({
  //       ...userContext,
  //       ...initialUserContext,
  //     })
  //   }
  // }

  const handleSubmit = async (values, setFieldError) => {
    setLoading(true)
    setLoginError(false)

    const response = await login(values.email, values.password)
    if (response.user) {
      //setCookie(JWT_COOKIE_DASHBOARD, response.token)

      // TODO: Get user data: assetEquities, watchedEquities, accountBalance
      userContext.setContext({
        ...userContext,
        token: response.token,
        userProfile: response.user,
      })
      setLoading(false)
      setSuccess(true)
      //Router.pushRoute('/portfolio')
    } else {
      setLoginError(true)
      setLoading(false)
    }
  }

  // useEffect(() => {
  //   logoutHandle()
  // }, [])

  return (
    <div className='flex flex-1 flex-col justify-center items-center text-lg'>
      <h2 className='uppercase text-4xl my-4'>{pageHeader}</h2>
      <Formik
        validationSchema={schema}
        initialValues={{}}
        onSubmit={(values, { setFieldError }) => {
          handleSubmit(values, setFieldError)
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className='w-full lg:w-1/2'>
            <Form>
              {loginError && <ErrorMsg>{errorMessage}</ErrorMsg>}
              <FormGroup>
                <label>Your Email</label>
                <FormInput
                  type='email'
                  name='email'
                  id='email'
                  placeholder='Enter your email'
                  value={values.email}
                  invalid={isFormSubmit && errors['email']}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                />
                {isFormSubmit && <ErrorMsg>{errors['email']}</ErrorMsg>}
              </FormGroup>
              <FormGroup>
                <label>Password</label>
                <FormInput
                  type='password'
                  name='password'
                  id='password'
                  placeholder='Enter your password'
                  value={values.password}
                  invalid={isFormSubmit && errors['password']}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                />
                {isFormSubmit && <ErrorMsg>{errors['password']}</ErrorMsg>}
              </FormGroup>
              <FormGroup>
                <button
                  type='submit'
                  className='bg-blue__medium text-white h-12'
                  disabled={loading}
                  onClick={(e) => {
                    e.preventDefault()
                    setFormSubmit(true)
                    handleSubmit()
                  }}
                >
                  {success ? 'Success!' : loading ? 'Logging in...' : 'Log In'}
                </button>
              </FormGroup>
            </Form>
            <div className='flex justify-between p-2 font-display'>
              <Link to='/register'>Register</Link>
              <Link to='/forgot-password'>Forgot Password?</Link>
            </div>
          </div>
        )}
      </Formik>
    </div>
  )
}

LoginPage.defaultProps = {
  pageHeader: 'Log In',
  errorMessage: 'Sorry, unable to log in with the email and password provided.',
}

export default LoginPage
