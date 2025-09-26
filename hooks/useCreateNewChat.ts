import streamClient from "@/lib/stream";

export const useCreateNewChat = () => {
  const createNewChat = async ({
    members,
    createdBy,
    groupName,
  }: {
    members: string[];
    createdBy: string;
    groupName?: string; //Optional group name for group chats
  }) => {
    const isGroupChat = members.length > 2; // More than 2 members indicates a group chat

    // Only check for existing 1-1 chats
    if (!isGroupChat) {
      const existingChannels = await streamClient.queryChannels(
        {
          type: "messaging",
          members: { $eq: members }, // Exact match for 1-1 chat
        },
        { created_at: -1 },
        { limit: 1 }
        // ).toPromise();
      );

      if (existingChannels.length > 0) {
        const channel = existingChannels[0];
        const channelMembers = Object.keys(channel.state.members);

        // For 1-1 chats, ensure exactly the same 2 members
        if (
          channelMembers.length === 2 &&
          members.length === 2 &&
          members.every((member) => channelMembers.includes(member))
        ) {
          console.log("Existing 1-1 chat found");
          return channel; // Return existing channel if found
        }
      }
    }

    const channelId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`; // Unique channel ID

    try {
      // Create channel with appropriate configuration for group vs 1-1 chat
      const channelData: {
        members: string[];
        created_by_id: string;
        name?: string;
      } = {
        members,
        created_by_id: createdBy,
      };

      // Add group name if it's a group chat and name is provided
      if (isGroupChat) {
        channelData.name =
          groupName || `Group chat (${members.length} members)`;
      }

      const channel = streamClient.channel(
        isGroupChat ? "team" : "messaging", // Use "team" type for group chats
        channelId,
        channelData
      );

      await channel.watch({
        presence: true,
      });
      return channel;
    } catch (error) {
      throw error;
    }
  };

  return createNewChat;
};
