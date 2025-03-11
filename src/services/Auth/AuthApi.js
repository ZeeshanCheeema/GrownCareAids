import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setCredentials} from './AuthReducer';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dev.api.crowdcareaid.com/api',
    prepareHeaders: async (headers, {getState}) => {
      const token = await AsyncStorage.getItem('accessToken');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Post', 'Campaign', 'User'],
  endpoints: builder => ({
    login: builder.mutation({
      query: userData => ({
        url: '/login',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          if (data?.access_token) {
            await AsyncStorage.setItem('accessToken', data.access_token);

            dispatch(
              setCredentials({
                token: data.access_token,
                user: data.user,
              }),
            );
          }
        } catch (error) {
          console.error('Login error:', error);
        }
      },
    }),

    signUp: builder.mutation({
      query: userData => ({
        url: '/signUp',
        method: 'POST',
        body: userData,
      }),
    }),

    verifyOtp: builder.mutation({
      query: otpData => ({
        url: '/verifyOtp',
        method: 'POST',
        body: otpData,
      }),
    }),

    resendOtp: builder.mutation({
      query: ({email}) => ({
        url: '/resendOtp',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: String(email)}), // Ensure email is a string
      }),
    }),

    forgetPassword: builder.mutation({
      query: ({email}) => ({
        url: '/forgotPassword',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: String(email)}),
      }),
    }),

    resetPassword: builder.mutation({
      query: passwordData => ({
        url: '/resetPassword',
        method: 'POST',
        body: passwordData,
      }),
    }),

    getAllCampaigns: builder.query({
      query: () => '/getAllCampaigns',
      providesTags: ['Campaign'],
    }),

    getRecentCampaigns: builder.query({
      query: () => '/getRecentCampaigns',
      providesTags: ['Campaign'],
    }),

    getCategories: builder.query({
      query: () => '/getCategories',
      providesTags: ['Campaign'],
    }),

    getAuthUserCampaign: builder.query({
      query: () => '/getAuthUserCampaign',
      providesTags: ['Campaign'],
    }),

    getCampaignDonators: builder.query({
      query: id => `/getCampaignDonators/${id}`,
    }),

    myDonationHistory: builder.query({
      query: () => `/myDonationHistory`,
    }),
    getUserNotifications: builder.query({
      query: () => `/getUserNotifications`,
    }),
    // In your AuthApi.js:
    getImage: builder.query({
      query: imageKey => `/getImage?key=${imageKey}`,
    }),

    createCampaign: builder.mutation({
      query: newCampaign => ({
        url: '/createCampaign',
        method: 'POST',
        body: newCampaign,
      }),
      invalidatesTags: ['Campaign'],
    }),
    uploadImage: builder.mutation({
      query: imageData => ({
        url: '/uploadImage', // Ensure this matches your backend API endpoint
        method: 'POST',
        body: imageData,
      }),
    }),

    deleteCampaign: builder.mutation({
      query: id => ({
        url: `/deleteCampaign/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Campaign'],
    }),

    updateCampaign: builder.mutation({
      query: ({id, ...newCampaign}) => ({
        url: `/updateCampaign/${id}`, // Send ID in URL
        method: 'PATCH',
        body: newCampaign, // Send rest of the data in the body
      }),
      invalidatesTags: ['Campaign'],
    }),

    donate: builder.mutation({
      query: donationData => ({
        url: '/donate',
        method: 'POST',
        body: donationData,
      }),
      invalidatesTags: ['Campaign'],
    }),

    createReport: builder.mutation({
      query: ({campaignId, reason}) => ({
        url: '/createReport',
        method: 'POST',
        body: {campaignId, reason},
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
        headers: {'content-type': 'application/json'},
      }),
    }),

    deleteAccount: builder.mutation({
      query: () => ({
        url: '/deleteAccount',
        method: 'DELETE',
      }),
    }),

    userProfile: builder.query({
      query: () => '/getUserProfile',
      providesTags: ['User'],
    }),

    editProfile: builder.mutation({
      query: data => ({
        url: '/editProfile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useSignUpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetAllCampaignsQuery,
  useGetRecentCampaignsQuery,
  useCreateCampaignMutation,
  useGetAuthUserCampaignQuery,
  useCreateReportMutation,
  useGetCampaignDonatorsQuery,
  useDeleteCampaignMutation,
  useUpdateCampaignMutation,
  useDonateMutation,
  useUserProfileQuery,
  useEditProfileMutation,
  useLogoutMutation,
  useMyDonationHistoryQuery,
  useGetUserNotificationsQuery,
  useGetImageQuery,
  useUploadImageMutation,
} = apiSlice;
