import { Campaign, Flow } from '../types';
import { MOCK_CAMPAIGNS, MOCK_FLOWS } from '../constants';

// Simulate network latency
const API_DELAY = 500;

/**
 * Fetches all campaigns from the backend (mocked).
 * @returns A promise that resolves to an array of campaigns.
 */
export const getCampaigns = (): Promise<Campaign[]> => {
  console.log('API (Mock): Fetching campaigns...');
  return new Promise(resolve => {
    setTimeout(() => {
      // In a real app, this would be a network request.
      // Here, we resolve with a copy of the mock data.
      resolve([...MOCK_CAMPAIGNS].sort((a, b) => (b.id > a.id ? 1 : -1)));
    }, API_DELAY);
  });
};

/**
 * Creates a new campaign (mocked).
 * @param campaignData Data for the new campaign.
 * @returns A promise that resolves to the newly created campaign.
 */
export const createCampaign = (campaignData: Omit<Campaign, 'id'>): Promise<Campaign> => {
    console.log('API (Mock): Creating new campaign...', campaignData);
    return new Promise(resolve => {
      setTimeout(() => {
        const newCampaign: Campaign = {
          ...campaignData,
          id: `camp${Date.now()}`, // Create a unique mock ID
        };
        // Note: This doesn't permanently add to MOCK_CAMPAIGNS,
        // the component's state handles the UI update.
        resolve(newCampaign);
      }, API_DELAY);
    });
};

/**
 * Fetches all automation flows from the backend (mocked).
 * @returns A promise that resolves to an array of flows.
 */
export const getFlows = (): Promise<Flow[]> => {
  console.log('API (Mock): Fetching flows...');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...MOCK_FLOWS]);
    }, API_DELAY);
  });
};


// We would add more functions here for audiences, templates, etc. as the backend is built.
// export const getAudiences = (): Promise<Audience[]> => ...
// export const createAudience = (data): Promise<Audience> => ...
