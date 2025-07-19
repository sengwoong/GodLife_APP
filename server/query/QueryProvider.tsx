import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState, useMemo } from 'react'
import { CompoundOption } from '../../components/Modal'
import { colors } from '../../constants'
import { View, Text } from 'react-native'

// 에러 모달 컴포넌트
function ErrorModal({ isVisible, hideModal, errorMessage }: { 
  isVisible: boolean; 
  hideModal: () => void; 
  errorMessage: string 
}) {
  return (
    <CompoundOption
      isVisible={isVisible}
      hideOption={hideModal}
      animationType="fade">
      <CompoundOption.Background>
        <CompoundOption.Container style={{ backgroundColor: colors.WHITE }}>
          <CompoundOption.Title>알림</CompoundOption.Title>
          <CompoundOption.Divider />
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: colors.BLACK, marginBottom: 10 }}>
              {errorMessage || "데이터가 없는 것 같습니다"}
            </Text>
          </View>
          <CompoundOption.Divider />
          <CompoundOption.Button onPress={hideModal}>
            확인
          </CompoundOption.Button>
        </CompoundOption.Container>
      </CompoundOption.Background>
    </CompoundOption>
  )
}

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // QueryClient 인스턴스를 useMemo로 메모이제이션
  const queryClient = useMemo(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 0, // 즉시 stale로 설정하여 항상 refetch 가능하게 함
          gcTime: 0, // 캐시 완전 비활성화
          retry: 1,
          refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 비활성화
          refetchOnReconnect: true,
          refetchOnMount: true, // 마운트 시 항상 refetch
        },
        mutations: {
          retry: 1,
        },
      },
    })

    // 전역 오류 핸들러 설정
    client.setDefaultOptions({
      queries: {
        // @ts-ignore
        onSettled: (data: unknown, error: Error | null) => {
          if (error) {
            console.error('Query error:', error)
            setErrorMessage(error.message || "데이터가 없는 것 같습니다")
            setIsErrorModalVisible(true)
          }
        },
      },
      mutations: {
        // @ts-ignore
        onSettled: (data: unknown, error: Error | null) => {
          if (error) {
            console.error('Mutation error:', error)
            setErrorMessage(error.message || "데이터가 없는 것 같습니다")
            setIsErrorModalVisible(true)
          }
        },
      },
    })

    return client
  }, [])

  const hideErrorModal = () => {
    setIsErrorModalVisible(false)
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ErrorModal 
        isVisible={isErrorModalVisible} 
        hideModal={hideErrorModal} 
        errorMessage={errorMessage} 
      />
    </QueryClientProvider>
  )
} 