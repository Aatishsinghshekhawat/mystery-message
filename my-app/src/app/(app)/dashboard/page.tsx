'use client'
import { Message } from '@/model/user'
import { acceptingMessageSchema } from '@/schemas/acceptingMessageSchema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setisLoading] = useState(false)
  const [isSwitchLoading, setisSwitchLoading] = useState(false)
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message.id !== messageId))
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptingMessageSchema)
  })

  const { register, watch, setValue } = form;
  const acceptingMessages = watch("acceptMessages")

  const fetchAcceptingMessage = useCallback(async () => {
    setisSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Error fetching accepting message status');
    } finally {
      setisSwitchLoading(false);
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setisLoading(true)
    setisSwitchLoading(false)
    try {

      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || [])
      if (refresh) {
        toast("Refreshed messages", {
          description: "Showing latest messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Error fetching accepting message status');
    } finally {
      setisLoading(false);
      setisSwitchLoading(false);
    }
  }, [setMessages, setisLoading,])


  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptingMessage();
  }, [setMessages, fetchAcceptingMessage, fetchMessages, session])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        AcceptMessages: !acceptingMessages
      })
      setValue('acceptMessages', !acceptingMessages);
      toast.success('Message settings updated successfully');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Error updating message settings');
    }
  }

  return (
    <div>

    </div>
  )
}

export default dashboard
