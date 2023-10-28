import { useEffect, useRef, useState } from 'react'

// react navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// interfaces
import { NavigatorParamList, ScreenType } from './navigation.type'
import { AppState, AppStateStatus } from 'react-native'

// firebase
import auth from '@react-native-firebase/auth'

// screens & navigator
import { SplashScreen } from '@/screens/splash'

// navigator
import BottomTabStackNavigator from './bottom-tab-stack.navigator'

// screens
import { BaseLayoutDetailScreen } from '@/screens/base-layout'
import { LoginScreen, RegisterScreen } from '@/screens/auth'
import { OnboardingScreen } from '@/screens/onboarding'
import { FeedbackScreen } from '@/screens/feedback'

// hooks
import { useAuth } from '@/hooks/auth'

// helpers / utils
// import { log } from '@/helpers'
import { storageUtils } from '@/utilities'
import { useFeedback } from '@/hooks'

const SCREENS: Array<ScreenType> = [
  { name: 'splash_screen', component: SplashScreen },
  { name: 'onboarding_screen', component: OnboardingScreen },
  { name: 'bottom_tab_stack', component: BottomTabStackNavigator },
  { name: 'base_layout_detail_screen', component: BaseLayoutDetailScreen },
  { name: 'register_screen', component: RegisterScreen },
  { name: 'login_screen', component: LoginScreen },
  { name: 'feedback_screen', component: FeedbackScreen },
]

const RootStack = createNativeStackNavigator<NavigatorParamList>()

const RootStackNavigator = (): JSX.Element | null => {
  const appState = useRef<AppStateStatus>(AppState.currentState)
  const [isAppLoaded, setIsAppLoaded] = useState(false)
  const [isAlreadyLaunched, setIsAlreadyLaunched] = useState(false)
  const [_, setAppStateVisible] = useState(appState.current)

  const { feedback_setHasSubmittedFeedback } = useFeedback()

  const { auth_setUser } = useAuth()

  const init = async (): Promise<void> => {
    // log.info('----- INIT DO SOMETHING -----')
  }

  const checkAlreadyLaunched = async (): Promise<void> => {
    const value = await storageUtils.get('IS_ALREADY_LAUNCHED')
    if (value) {
      setIsAlreadyLaunched(Boolean(value) ?? false)
    } else {
      setIsAlreadyLaunched(false)
    }
  }

  const checkHasSubmittedFeedback = async (): Promise<void> => {
    const hasSubmitted = (await storageUtils.get('SUBMITTED_FEEDBACK')) ?? false
    feedback_setHasSubmittedFeedback(hasSubmitted)
  }

  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
      checkAlreadyLaunched().then(() => {
        setIsAppLoaded(true)
      })
      checkHasSubmittedFeedback()
    })()

    init()
    // ! check appstate, and run function in case user change permmission
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        // appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // checkLocPermissionState()
      }

      appState.current = nextAppState
      setAppStateVisible(appState.current)
    })
    return () => {
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      // log.warn(`onAuthStateChanged user -> ${JSON.stringify(user)}`)
      auth_setUser(user)
    })
    return subscriber // unsubscribe on unmount
  }, [])

  if (!isAppLoaded) {
    return null
  }

  return (
    <RootStack.Navigator
      initialRouteName={isAlreadyLaunched ? 'bottom_tab_stack' : 'onboarding_screen'}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {SCREENS.map(x => {
        return <RootStack.Screen key={x.name} component={x.component} name={x.name} options={x.options} />
      })}
    </RootStack.Navigator>
  )
}

export default RootStackNavigator
