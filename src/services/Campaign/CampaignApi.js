// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const baseQuery = fetchBaseQuery({
//   baseUrl: 'https://dev.api.crowdcareaid.com/api/',
// });

// export const campaignApi2 = createApi({
//   reducerPath: 'campaignApi',
//   baseQuery,
//   tagTypes: ['Campaign'],
//   endpoints: builder => ({
//      }),
// });

// export const {
//   useGetAllCampaignsQuery,
//   useGetRecentCampaignsQuery,
//   useCreateCampaignMutation,
//   useGetCategoriesQuery,
//   useGetAuthUserCampaignQuery,
//   useCreateReportMutation,
//   useGetCampaignDonatorsQuery,
//   useDeleteCampaignMutation,
//   useUpdateCampaignMutation,
//   useDonateMutation,
// } = campaignApi;
// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

// // Base query
// const baseQuery = fetchBaseQuery({
//   baseUrl: 'https://dev.api.crowdcareaid.com/api/',
// });

// // Campaign API
// export const campaignApi = createApi({
//   reducerPath: 'campaignApi',
//   baseQuery,
//   tagTypes: ['Campaign'],
//   endpoints: builder => ({
//     getAllCampaigns: builder.query({
//       query: () => 'getAllCampaigns',
//       providesTags: ['Campaign'],
//     }),

//     getRecentCampaigns: builder.query({
//       query: () => 'getRecentCampaigns',
//       providesTags: ['Campaign'],
//     }),

//     getCategories: builder.query({
//       query: () => 'getCategories',
//       providesTags: ['Campaign'],
//     }),

//     getAuthUserCampaign: builder.query({
//       query: () => 'getAuthUserCampaign',
//       providesTags: ['Campaign'],
//     }),

//     getCampaignDonators: builder.query({
//       query: id => `getCampaignDonators/${id}`,
//     }),

//     createCampaign: builder.mutation({
//       query: newCampaign => ({
//         url: 'createCampaign',
//         method: 'POST',
//         body: newCampaign,
//       }),
//       invalidatesTags: ['Campaign'],
//     }),

//     deleteCampaign: builder.mutation({
//       query: id => ({
//         url: `deleteCampaign/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Campaign'],
//     }),

//     updateCampaign: builder.mutation({
//       query: ({id, ...updatedData}) => ({
//         url: `updateCampaign/${id}`,
//         method: 'PATCH',
//         body: updatedData,
//       }),
//       invalidatesTags: ['Campaign'],
//     }),

//     donate: builder.mutation({
//       query: donationData => ({
//         url: 'donate',
//         method: 'POST',
//         body: donationData,
//       }),
//       invalidatesTags: ['Campaign'],
//     }),

//     createReport: builder.mutation({
//       query: ({campaignId, reason}) => ({
//         url: 'createReport',
//         method: 'POST',
//         body: {campaignId, reason},
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }),
//     }),
//   }),
// });

// export const {
//   useGetAllCampaignsQuery,
//   useGetRecentCampaignsQuery,
//   useCreateCampaignMutation,
//   useGetCategoriesQuery,
//   useGetAuthUserCampaignQuery,
//   useCreateReportMutation,
//   useGetCampaignDonatorsQuery,
//   useDeleteCampaignMutation,
//   useUpdateCampaignMutation,
//   useDonateMutation,
// } = campaignApi;
