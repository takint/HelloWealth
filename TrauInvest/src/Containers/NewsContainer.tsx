import React, { useState, useEffect } from 'react'
import moment from 'moment'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { getNewsFromYahoo } from '@/Services/api'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginVertical: 5,
    width: '100%',
  },
  item: {
    padding: 10,
    marginTop: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 90,
    height: 90,
  },
  textContainer: {
    width: '70%',
  },
})

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, textColor]}>{item.title}</Text>
        <Text style={[textColor]}>{item?.provider?.displayName}</Text>
        <Text style={[textColor]}>
          {moment(item?.pubDate).format('YYYY-MM-DD HH:mm')}
        </Text>
      </View>
      <Image
        style={styles.logo}
        source={{
          uri: item?.thumbnail?.resolutions[3]?.url,
        }}
      />
    </View>
  </TouchableOpacity>
)

const NewsContainer = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const [userId, setUserId] = useState('9')
  const [newsList, setNewsList] = useState([])
  const [fetchOne, { data, isSuccess, isLoading, isFetching, error }] =
    useLazyFetchOneQuery()

  useEffect(() => {
    fetchOne(userId)
    getNewsFromYahoo()
      .then((response: Response) => response.json())
      .then((res: any) => {
        if (res.status === 'OK') {
          const parsedNews = res.data.main.stream.map((item: any) => {
            return {
              ...item.content,
            }
          })
          setNewsList(parsedNews)
        }
      })
  }, [fetchOne, userId])

  const [selectedId, setSelectedId] = useState(null)

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? '#058D4A' : '#fff'
    const color = item.id === selectedId ? 'white' : 'black'

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    )
  }

  return (
    <ScrollView
      style={Layout.fill}
      contentContainerStyle={[
        Layout.fill,
        Layout.colCenter,
        Gutters.smallHPadding,
      ]}
    >
      <FlatList
        data={newsList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
    </ScrollView>
  )
}

export default NewsContainer
