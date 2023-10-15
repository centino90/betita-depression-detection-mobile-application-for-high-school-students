import * as React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Divider, IconButton, List, MD3Colors, Text } from 'react-native-paper';
import { useQuery } from 'react-query';
import FetchStudentsRankedByDepressionScoreHook from '../hooks/FetchStudentsRankedByDepressionScoreHook';
import { BACKEND_URL } from '@env'
import SendCounselNotificationHook from '../hooks/SendCounselNotificationHook';

const NotifButton = ({ studentId, refetch, icon='bell-alert-outline', ...props }) => {
    const [loading, setLoading] = React.useState(false)

    const handleNotificationPress = () => {
        setLoading(true)
        SendCounselNotificationHook({ URL: `${BACKEND_URL}/admin/student/notifyForCounseling/${studentId}` }).then(res => {
            refetch()
            setLoading(false)
        })
    }

    if (loading) {
        return <ActivityIndicator {...props} animating={true} size={22} />
    }
    return (
        <IconButton {...props} style={{ margin: 0 }} icon={icon} iconColor={MD3Colors.primary50} size={25} onPress={() => handleNotificationPress()} />
    )
}

const AdminDepressedStudentsPage = () => {
    const { isLoading, error, data, refetch } = useQuery('students', () =>
        FetchStudentsRankedByDepressionScoreHook({ URL: `${BACKEND_URL}/admin/students` }, {
            retry: 10,
            manual: true
        })
    )
    if (isLoading) {
        return <ActivityIndicator animating={true} size={'large'} />
    }
    if (error) {
        return <Text>{error}</Text>
    }

    console.log(data)

    return (
        <View>
            {data.data.length === 0 
             ? 
                <Text variant="titleMedium" style={{ marginBottom: 25, marginTop: 25 }}>There are no depressed students at the moment...</Text>
             :
              <>
                <Text variant="titleMedium" style={{ marginBottom: 25, marginTop: 25 }}>Students ranked by depression score</Text>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    {data.data.map((item, index) => (
                        <View>
                            <List.Item
                                key={item.id}
                                title={item.email}
                                description={`${item.symptom} | ${item.age} yrs old | ${item.gender}`}
                                left={props => <Text variant='displaySmall'>{item.totalScore <= 9 ? `0${item.totalScore}` : item.totalScore}</Text>}
                                right={props => {
                                    if (item.isNotified && !item.isNotificationConfirmed) {
                                        return (<NotifButton {...props} studentId={item.id} icon={'bell-badge'} refetch={refetch} />)
                                    } else if (item.isNotificationConfirmed && !item.isNotified) {
                                        return (<IconButton {...props} style={{ margin: 0 }} icon="bell-check" iconColor={MD3Colors.primary50} size={25} />)
                                    } else {
                                        return (<NotifButton {...props} studentId={item.id} refetch={refetch} />)
                                    }
                                }}
                            />
                            <Divider />
                        </View>
                    ))}
                </View>
              </> 
            }
          
        </View>
    )
}

export default AdminDepressedStudentsPage