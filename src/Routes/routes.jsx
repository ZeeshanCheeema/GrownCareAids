import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

// Import your screens
import Onboarding from '../components/Onboarding';
import Home from '../screens/Home';
import Login from '../screens/Auth/Login';
import Signup from '../screens/Auth/signup';
import ForgetPassword from '../screens/Auth/ForgetPassword';
import OTPCode from '../screens/Auth/OTPCode';
import NewPassword from '../screens/Auth/NewPassword';
import SignupOtp from '../screens/Auth/SingupOTp';
import CampaignScreen from '../screens/CampaignScreen';
import BottomTab from './BottomNav/BottomTab';
import FundraiserDetails from '../screens/Campaign/FundraiserDetails';
import Review from '../screens/Campaign/Review';
import AmountDetails from '../screens/Campaign/AmountDetails';
import SearchViewCampaign from '../components/SearchViewCampaign';
import ReportModel from '../components/ReportModel';
import MyCampaign from '../screens/MyCampaign';
import myCampaignEdit from '../screens/myCampaignEdit';
import MyProfile from '../screens/Profile/MyProfile';
import EditProfile from '../screens/Profile/EditProfile';
import SettingsScreen from '../screens/Setting/Setting';
import TermCondition from '../screens/Setting/TermCondition';
import PrivacyPolicy from '../screens/Setting/PrivacyPolicy';
import DonationHistory from '../screens/Setting/DonationHistory';
import Language from '../screens/Setting/Language';
import FAQ from '../screens/Setting/FAQ';
import DonationModal from '../components/DonateModel';
import InitialScreen from '../Routes/InitailScreen';

const Stack = createStackNavigator();

const Routes = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="InitialScreen">
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="InitialScreen" component={InitialScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="OTPCode" component={OTPCode} />
        <Stack.Screen name="NewPassword" component={NewPassword} />
        <Stack.Screen name="SignupOtp" component={SignupOtp} />
        <Stack.Screen name="CampaignScreen" component={CampaignScreen} />
        <Stack.Screen name="BottomTab" component={BottomTab} />
        <Stack.Screen name="FundraiserDetails" component={FundraiserDetails} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Review" component={Review} />
        <Stack.Screen name="ReportModel" component={ReportModel} />
        <Stack.Screen name="MyCampaign" component={MyCampaign} />
        <Stack.Screen name="myCampaignEdit" component={myCampaignEdit} />
        <Stack.Screen name="MyProfile" component={MyProfile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="TermCondition" component={TermCondition} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="DonationHistory" component={DonationHistory} />
        <Stack.Screen name="Language" component={Language} />
        <Stack.Screen name="FAQ" component={FAQ} />
        <Stack.Screen name="DonationModal" component={DonationModal} />
        <Stack.Screen
          name="SearchViewCampaign"
          component={SearchViewCampaign}
        />
        <Stack.Screen name="AmountDetails" component={AmountDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
