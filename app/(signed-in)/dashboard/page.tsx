"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  Window,
} from "stream-chat-react";
import { Channel } from "stream-chat-react";
import { Button } from "@/components/ui/button";
import { LogOutIcon, VideoIcon } from "lucide-react";
import { toast } from "react-toastify";
import { ConfirmToast } from "@/components/confirmToast";

function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const { channel, setActiveChannel } = useChatContext();
  const { setOpen } = useSidebar();

  const handleCall = () => {
   if(!channel) return;
   router.push(`/dashboard/video-call/${channel.id}`)
   setOpen(false);
  };

  const handleLeaveChat = async () => {
    if (!channel || !user?.id) {
      toast.error("No active channel or user");
      return;
    }

    toast(
      <ConfirmToast
        message="Are you sure you want to leave this chat?"
        onConfirm={async () => {
          try {
            await channel.removeMembers([user.id]);
            setActiveChannel(undefined);
            toast.success("You’ve successfully left the chat!");
            router.push("/dashboard");
          } catch (error) {
            console.error("Error leaving chat:", error);
            toast.error("Could not leave the chat. Please try again.");
          }
        }}
        onCancel={() => {
          toast.info("Cancelled – you’re still in the chat.");
        }}
      />,
      { autoClose: false }
    );
  };

  return (
    <div className="flex flex-col w-full flex-1">
      {channel ? (
        <div>
          <Channel>
            <Window>
              <div className="flex items-center justify-between">
                {channel.data?.member_count === 1 ? (
                  <ChannelHeader title="Everyone else has left this chat!" />
                ) : (
                  <ChannelHeader />
                )}

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleCall}>
                    <VideoIcon className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleLeaveChat}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    Leave Chat
                  </Button>
                </div>
              </div>

              <MessageList />
              <div className="sticky bottom-0 w-full">
                <MessageInput />
              </div>
            </Window>
            <Thread />
          </Channel>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
            No chat selected
          </h2>
          <p className="text-muted-foreground">
            Select a chat from the sidebar or start a new conversation
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
