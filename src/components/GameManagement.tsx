import React, { memo, useCallback, useEffect, useState } from 'react'
import {
  Flex,
  VStack,
  Box,
  FormControl,
  FormLabel,
  Spacer,
  Text,
  NumberInputField,
  NumberInput,
  Alert,
  AlertIcon,
  CloseButton,
  useClipboard,
  Wrap,
  Button,
  OrderedList,
  ListItem,
  HStack,
  useDisclosure,
} from '@chakra-ui/react'
import { useGetGame } from '../hooks/useGetGame'
import { FaCopy, FaPlus, FaFileExport, FaUsers } from 'react-icons/fa'
import NumberBox from './NumberBox'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { useGameStore, useTeamStore, useLoadingStore, useRoundStore, useUserStore } from '../store'
import Screen from './Screen'
import If from './If'
import { NUMBER_MAX } from '../utils/constans'
import { randomBingo } from '../utils/random'
import { delay } from '../utils/helpers'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Round } from '../db/v1'
import PlayersDrawer from './PlayersDrawer'
import PrimaryIconButton from './PrimaryIconButton'
import PrimarySwitch from './PrimarySwitch'

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const fileExtension = '.xlsx'

type Props = {
  id: string
}

export default memo(function GameManagement({ id }: Props) {
  useGetGame(id)
  const { game, triggerDone, triggerRegister, addNumberBingo, getWinners } = useGameStore()
  const userId = useUserStore(state => state.user?.id)
  const { showLoading, hideLoading } = useLoadingStore()
  const exportMemberCsv = useTeamStore(state => state.getPlayersOfGame)
  const supabaseClient = useSupabaseClient()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [number, setNumber] = useState(0)
  const [numbers, setNumbers] = useState<number[]>([])
  const [winners, setWinners] = useState<Round[]>([])
  const [err, setErr] = useState('')

  const { onCopy, setValue } = useClipboard(game?.entry_code + '')

  const getListWinner = useCallback(
    async (gameId: string) => {
      const data = await getWinners(gameId)
      if (data) setWinners(data)
    },
    [getWinners],
  )

  useEffect(() => {
    setValue(game?.entry_code + '')
  }, [game?.entry_code, setValue])

  const handleNewMessage = useCallback(
    (row: any) => {
      if (row?.new?.game_id === game?.id) {
        game?.id && getListWinner(game.id)
      }
    },
    [getListWinner, game?.id],
  )

  useEffect(() => {
    const subscription = supabaseClient
      .channel('public:rounds')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rounds' },
        handleNewMessage,
      )
      .subscribe()
    return () => {
      subscription.unsubscribe()
    }
  }, [handleNewMessage, supabaseClient])

  const convertData = useCallback((str: string) => {
    try {
      const rs = JSON.parse(str)
      setNumbers(rs)
    } catch (error) {}
  }, [])

  useEffect(() => {
    game?.numbers && convertData(game.numbers)
  }, [convertData, game?.numbers])

  useEffect(() => {
    game?.id && getListWinner(game.id)
  }, [getListWinner, game?.id])

  const onChangeRegister = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      showLoading()
      userId && (await triggerRegister(id, userId, e.target.checked))
      hideLoading()
    },
    [hideLoading, id, showLoading, triggerRegister, userId],
  )

  const onChangeDone = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      showLoading()
      userId && (await triggerDone(id, userId, e.target.checked))
      hideLoading()
    },
    [hideLoading, id, showLoading, triggerDone, userId],
  )

  const onChangeNumber = useCallback((e: string, v: number) => {
    setNumber(v)
  }, [])

  const addNumber = useCallback(async () => {
    setErr('')
    if (!game || !userId) return
    if (game.completed) {
      return setErr("Finished game can't add numbers")
    }
    if (!number) return
    try {
      showLoading()
      const rs = JSON.parse(game.numbers)
      if (rs?.includes(number)) {
        return setErr('This number already exists')
      }
      if (rs?.length > 0) {
        await addNumberBingo(id, userId, JSON.stringify([...rs, number]))
      } else {
        await addNumberBingo(id, userId, JSON.stringify([number]))
      }
    } finally {
      hideLoading()
    }
  }, [game, userId, number, showLoading, addNumberBingo, id, hideLoading])

  const addNumberByNumber = useCallback(
    async (bingo: number) => {
      setErr('')
      if (!game || !userId) return
      if (game?.completed) {
        return setErr("Finished game can't add numbers")
      }
      if (!bingo) return
      try {
        showLoading()
        const numbers = JSON.parse(game.numbers)
        if (numbers?.includes(bingo)) {
          return setErr('This number already exists')
        }
        if (numbers?.length > 0) {
          await addNumberBingo(id, userId, JSON.stringify([...numbers, bingo]))
        } else {
          await addNumberBingo(id, userId, JSON.stringify([bingo]))
        }
      } finally {
        hideLoading()
      }
    },
    [game, userId, showLoading, addNumberBingo, id, hideLoading],
  )

  const removeNumber = useCallback(
    async (num: number) => {
      if (!num || !game || !userId) return
      try {
        if (game.completed) {
        }
        showLoading()
        const rs = JSON.parse(game.numbers)
        if (rs?.length > 0) {
          const newList = rs.filter((item: number) => item !== num)
          await addNumberBingo(id, userId, JSON.stringify([...newList]))
        }
      } catch (error) {
      } finally {
        hideLoading()
      }
    },
    [game, userId, showLoading, addNumberBingo, id, hideLoading],
  )

  const onExportCsv = useCallback(async () => {
    try {
      if (!game) return
      const grId = game.id
      const members = await exportMemberCsv(grId)
      if (members) {
        const dataLean = members.map((item: any) => {
          return {
            Name: item.users?.full_name,
            Code: item.code,
          }
        })
        if (dataLean?.length > 0) {
          const ws = XLSX.utils.json_to_sheet(dataLean)
          const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
          const excelBuffer = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array',
          })
          const data = new Blob([excelBuffer], { type: fileType })
          FileSaver.saveAs(data, 'List ' + game?.entry_code + fileExtension)
        }
      }
    } catch (_) {}
  }, [exportMemberCsv, game])

  const handleBingo = useCallback(async () => {
    if (numbers?.length === NUMBER_MAX) return
    showLoading()
    await delay(3000)
    let bingo = randomBingo(1, NUMBER_MAX)
    while (numbers.includes(bingo)) {
      bingo = randomBingo(1, NUMBER_MAX)
    }
    await addNumberByNumber(bingo)
    hideLoading()
  }, [numbers, showLoading, addNumberByNumber, hideLoading])

  const resetError = useCallback(() => {
    setErr('')
  }, [])

  if (!game) return <Screen />

  return (
    <Screen>
      <VStack px="4" flex={1} alignItems="flex-start" fontWeight="bold" w="100%" color="textLight">
        <Flex
          w="100%"
          fontSize="2xl"
          fontWeight="bold"
          justifyContent="center"
          bg="main.2"
          borderRadius="12px"
          py="18px"
          px="8px">
          <Text>{game.name}</Text>
        </Flex>
        <HStack
          w="100%"
          alignItems="center"
          bg="main.2"
          borderRadius="12px"
          py="18px"
          px="8px"
          justifyContent="space-between">
          <HStack>
            <Text mr="4px" fontSize="xl" fontWeight="semibold">
              {game.entry_code}
            </Text>
            <PrimaryIconButton aria-label="copy" icon={<FaCopy />} onClick={onCopy} />
          </HStack>
          <PrimaryIconButton aria-label="copy" icon={<FaUsers />} onClick={onOpen} />
        </HStack>
        <If
          condition={game.team_play_game && game.team_play_game?.length > 0}
          component={
            <VStack bg="main.2" borderRadius="12px" py="18px" px="8px">
              <Text mr="8" fontSize="xl" fontWeight="semibold">
                Teams joined
              </Text>
              <Wrap>
                {game.team_play_game?.map(team => (
                  <Box key={team.id} p="2" borderRadius="md">
                    <Text fontSize="md" fontWeight="semibold">
                      {team.teams?.name}
                    </Text>
                  </Box>
                ))}
              </Wrap>
            </VStack>
          }
          fallback={null}
        />
        <HStack
          w="100%"
          justifyContent="space-between"
          bg="main.2"
          borderRadius="12px"
          py="18px"
          px="8px">
          <Text fontSize="md" fontWeight="semibold">
            Download players
          </Text>
          <PrimaryIconButton aria-label="export" icon={<FaFileExport />} onClick={onExportCsv} />
        </HStack>
        <VStack w="100%" bg="main.2" borderRadius="12px" py="18px" px="8px">
          <Flex w="100%">
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="stop-register" mb="0">
                Allow other players to join
              </FormLabel>
              <Spacer />
              {typeof game.open_register === 'boolean' && (
                <PrimarySwitch
                  name="stop-register"
                  isChecked={game.open_register}
                  onChange={onChangeRegister}
                />
              )}
            </FormControl>
          </Flex>
          <Box height="12px" />
          <Flex w="100%">
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="stop-register" mb="0">
                Mark the game as the end
              </FormLabel>
              <Spacer />
              {typeof game.completed === 'boolean' && (
                <PrimarySwitch
                  name="stop-register"
                  isChecked={game.completed}
                  onChange={onChangeDone}
                />
              )}
            </FormControl>
          </Flex>
        </VStack>
        <VStack w="100%" alignItems="flex-start" bg="main.2" borderRadius="12px" py="18px" px="8px">
          <Text fontSize="xl" fontWeight="semibold">
            Winners
          </Text>
          <If
            condition={winners?.length > 0}
            component={
              <OrderedList>
                {winners?.map(winner => (
                  <ListItem key={winner.id}>
                    <Text fontSize="xl" fontWeight="semibold" color="text">
                      {winner.users?.email}
                    </Text>
                  </ListItem>
                ))}
              </OrderedList>
            }
            fallback={
              <Text fontWeight="light" fontSize="sm">
                No one
              </Text>
            }
          />
        </VStack>
        <Box height="18px" />
        <Flex>
          <Button colorScheme="cyan" onClick={handleBingo}>
            <Text fontSize="2xl" color="textLight">
              Bingo
            </Text>
          </Button>
        </Flex>
        <Flex w="100%" alignItems="center" justifyContent="space-between">
          <NumberInput
            borderColor="main.3"
            focusBorderColor="main.3"
            size="md"
            w="350px"
            min={0}
            max={NUMBER_MAX}
            keepWithinRange={true}
            clampValueOnBlur={true}
            inputMode="numeric"
            onChange={onChangeNumber}>
            <NumberInputField placeholder="Type a number" color="text" fontWeight="semibold" />
          </NumberInput>
          <PrimaryIconButton
            disabled={number === 0}
            aria-label="add-number-bingo"
            ml="4"
            icon={<FaPlus />}
            onClick={addNumber}
          />
        </Flex>
        {err && (
          <Alert status="error">
            <AlertIcon />
            <Text fontSize="lg" color="text" fontWeight="light">
              {err}
            </Text>
            <CloseButton
              onClick={resetError}
              position="absolute"
              color="text"
              right="8px"
              top="8px"
            />
          </Alert>
        )}
        <Wrap w="100%">
          {numbers.map(num => (
            <NumberBox number={num} key={num} onDelete={removeNumber} />
          ))}
        </Wrap>
      </VStack>
      <PlayersDrawer gameId={game.id} isOpen={isOpen} onClose={onClose} />
    </Screen>
  )
})
