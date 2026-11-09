
import { mockRegistrations } from "@/data/mockEvents";
import type { Registration, RegistrationInput } from "@/types/registration";
import {
  apiMode,
  apiRequest,
  getStoredMock,
  saveStoredMock,
} from "@/services/api";

const REGISTRATIONS_KEY = "eventease_mock_registrations";
const mockList = () => getStoredMock(REGISTRATIONS_KEY, mockRegistrations);

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message);
      return parsed.message || error.message;
    } catch {
      return error.message;
    }
  }

  if (typeof error === "string") {
    try {
      const parsed = JSON.parse(error);
      return parsed.message || error;
    } catch {
      return error;
    }
  }

  return "Registration failed. Please try again.";
};

export const registrationService = {
  register: async (eventId: string, input: RegistrationInput) => {
    if (apiMode) {
      try {
        const response = await apiRequest<
          Registration | {
            success: boolean;
            message?: string;
          }
        >(
          `/events/${encodeURIComponent(eventId)}/registrations`,
          {
            method: "POST",
            body: JSON.stringify(input),
          }
        );

        if (
          "success" in response &&
          response.success === false
        ) {
          throw new Error(
            response.message || "Registration failed."
          );
        }

        return response;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    }

    const registration: Registration = {
      ...input,
      event_id: eventId,
      id: `reg-${crypto.randomUUID()}`,
      created_at: new Date().toISOString(),
    };

    saveStoredMock(REGISTRATIONS_KEY, [registration, ...mockList()]);
    return registration;
  },

  listAll: async (eventIds: string[]): Promise<Registration[]> => {
    if (apiMode) {
      const groups = await Promise.all(
        eventIds.map(async (id) => {
          const response = await apiRequest<
            Registration[] | { registrations?: Registration[] }
          >(
            `/admin/events/${encodeURIComponent(id)}/registrations`
          );

          if (Array.isArray(response)) return response;

          if (Array.isArray(response.registrations)) {
            return response.registrations;
          }

          return [];
        })
      );

      return groups
        .flat()
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
    }

    return mockList().sort((a, b) =>
      b.created_at.localeCompare(a.created_at)
    );
  },
};
