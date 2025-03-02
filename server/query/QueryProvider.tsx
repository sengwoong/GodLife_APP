import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
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

  // QueryClient 인스턴스 생성
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, 
        gcTime: 60 * 60 * 1000, 
        retry: 1,
      },
    },
  })

  // 전역 오류 핸들러 설정
  queryClient.setDefaultOptions({
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