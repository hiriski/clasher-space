import { View } from 'react-native'
import { Button, Screen, Typography } from '@/components/core'
import { paletteLibs } from '@/libs/palette/_palette.lib'
import { useApp, useFeedback, useTheme } from '@/hooks'
import { useNavigation } from '@react-navigation/native'
import { NavigationProps } from '@/navigators'
import { storageUtils } from '@/utilities'
import { useCallback } from 'react'
import { FloatingFeedbackButton } from '@/components/feedback'
import BottomSheetFeedback from '@/components/feedback/bottom-sheet-feedback'
import { useTranslation } from 'react-i18next'
import { AppLanguageCode } from '@/interfaces'
import { appLibs } from '@/libs'

const DashboardScreen = (): JSX.Element => {
  const theme = useTheme()
  const nav = useNavigation<NavigationProps>()
  const { setVisibleBottomTab, visibleBottomTab, lang, app_setLang } = useApp()
  const { t, i18n } = useTranslation()

  const { hasSubmittedFeedback } = useFeedback()

  const onPressToggleBottomTab = useCallback(() => {
    setVisibleBottomTab(!visibleBottomTab)
  }, [visibleBottomTab])

  // prettier-ignore
  const onChangeLang = useCallback((_code: AppLanguageCode) => {
    if (i18n.language !== _code) {
      app_setLang(_code)
    }
  },[lang, i18n.language])

  return (
    <>
      <Screen
        preset='fixed'
        statusBarStyle='light-content'
        title='Dashboard'
        titleColor='#ffffff'
        headerBackgroundColor={paletteLibs.grey[800]}
        backgroundColor={theme.palette.background.paper}
        style={{ paddingTop: 12, paddingHorizontal: theme.horizontalSpacing }}
      >
        <View style={{ flex: 1 }}>
          <Typography variant='h3' gutterBottom={2} style={{ textAlign: 'center' }}>
            {t('common.hello')}
          </Typography>
          <Button title='Toggle Bottom Tabb' onPress={onPressToggleBottomTab} style={{ marginBottom: 20 }} />
          <Button
            title='Navigate to layout list'
            onPress={() => nav.navigate('base_layout_list_screen')}
            style={{ marginBottom: 20 }}
          />
          <Button title='Go to profile' onPress={() => nav.navigate('profile_screen')} style={{ marginBottom: 20 }} />
          <Button title='Clear storage' onPress={() => storageUtils.clear()} style={{ marginBottom: 20 }} />
          <Button title='Register' color='secondary' onPress={() => nav.navigate('register_screen')} style={{ marginBottom: 12 }} />
          <Button title='Login' color='secondary' onPress={() => nav.navigate('login_screen')} />

          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <Typography gutterBottom={2}>Set lang</Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {appLibs.appLanguages.map(x => (
                <Button
                  onPress={() => onChangeLang(x.code)}
                  key={x.code}
                  title={x.name}
                  color='primary'
                  variant={i18n.language === x.code ? 'contained' : 'outlined'}
                  style={{ marginHorizontal: 2 }}
                  rounded
                />
              ))}
            </View>
          </View>
        </View>
      </Screen>
      {!hasSubmittedFeedback && (
        <>
          <FloatingFeedbackButton />
          <BottomSheetFeedback />
        </>
      )}
    </>
  )
}

export default DashboardScreen
