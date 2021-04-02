import { useContext, useState, useEffect } from 'react'
import { Formik } from 'formik'
import { Form } from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import { ErrorMsg, FormGroup, FormInput } from '../styles/global.styles'
import { login, getUserPorfolio } from '../services/api'
import { dynamicValidation, isNullOrEmpty } from '../services/helper'
import { UserContext } from '../services/context'
import { setCookie, JWT_COOKIE } from '../services/cookies'

export const LoginPage = ({ pageHeader, errorMessage }) => {
  const userContext = useContext(UserContext)
  const history = useHistory()
  const [isFormSubmit, setFormSubmit] = useState()
  const [loginError, setLoginError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const schema = dynamicValidation([
    { name: 'email', required: true, type: 'text', label: 'Email' },
    { name: 'password', required: true, label: 'Password' },
  ])

  const handleSubmit = async (values, setFieldError) => {
    setLoading(true)
    setLoginError(false)

    const response = await login(values.email, values.password)

    if (response.ok && !isNullOrEmpty(response.user)) {
      setCookie(JWT_COOKIE, response.access_token)
      const porfolioRes = await getUserPorfolio(response.access_token)

      if (porfolioRes.ok) {
        userContext.setContext({
          ...userContext,
          token: response.access_token,
          refresh_token: response.refresh_token,
          isAuthorized: true,
          alerts: porfolioRes.alerts,
          accountBalance: parseFloat(porfolioRes.accountBalance),
          assetEquities: porfolioRes.assetEquities,
          watchedEquities: porfolioRes.watchedEquities,
          userProfile: {
            userId: response.user.pk,
            username: response.user.username,
            email: response.user.email,
            firstName: response.user.first_name,
            lastName: response.user.last_name,
          },
        })
      }

      setLoading(false)
      setSuccess(true)
      history.push('/dashboard')
    } else {
      setLoginError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    return function cleanup() {}
  })

  return (
    <div className='flex flex-1 flex-col justify-center items-center text-lg'>
      <h2 className='uppercase text-4xl my-4'>{pageHeader}</h2>
      <Formik
        validationSchema={schema}
        initialValues={{ email: '', password: '' }}
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
