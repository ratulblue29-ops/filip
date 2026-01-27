import { View } from 'react-native'
import { Calendar } from 'react-native-calendars';
const CalendarCompo = ({ startDate, endDate, setStartDate, setEndDate }: any) => {
    type MarkedDates = {
        [key: string]: {
            selected?: boolean;
            startingDay?: boolean;
            endingDay?: boolean;
            color?: string;
            textColor?: string;
        };
    };
    const getMarkedDates = (): MarkedDates => {
        const marked: MarkedDates = {};
        if (!startDate || !endDate) return marked;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const current = new Date(start);

        while (current <= end) {
            const dateStr = current.toISOString().split('T')[0];
            marked[dateStr] = {
                selected: true,
                color: '#FFD900',
                textColor: '#111111',
                startingDay: dateStr === startDate,
                endingDay: dateStr === endDate,
            };
            current.setDate(current.getDate() + 1);
        }
        return marked;
    };
    return (
        <View>
            <Calendar
                current="2025-02-01"
                markingType="period"
                markedDates={getMarkedDates()}
                onDayPress={(day) => {
                    if (!startDate || (startDate && endDate)) {
                        setStartDate(day.dateString);
                        setEndDate('');
                    } else {
                        if (new Date(day.dateString) < new Date(startDate)) {
                            setStartDate(day.dateString);
                        } else {
                            setEndDate(day.dateString);
                        }
                    }
                }}
                theme={{
                    calendarBackground: '#1E1E1E',
                    textSectionTitleColor: '#FFD900',
                    selectedDayBackgroundColor: '#FFD900',
                    selectedDayTextColor: '#111111',
                    todayTextColor: '#FFD900',
                    dayTextColor: '#FFFFFF',
                    textDisabledColor: '#666666',
                    monthTextColor: '#FFFFFF',
                    textMonthFontFamily: 'InterDisplayMedium',
                    textDayFontFamily: 'InterDisplayRegular',
                    textMonthFontWeight: '500' as any,
                    textDayFontWeight: '400' as any,
                    textDayHeaderFontFamily: 'InterDisplayMedium',
                    arrowColor: '#FFD900',
                    textDayHeaderFontSize: 18,
                }}
                style={{
                    borderRadius: 16,
                    padding: 10,
                }}
            />
        </View>
    )
}

export default CalendarCompo