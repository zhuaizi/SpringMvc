/*
Copyright 2014, KISSY v1.47
MIT Licensed
build time: May 22 12:17
*/
/**
 * locale info for KISSY Date
 * @ignore
 * @author yiminghe@gmail.com
 */
KISSY.add('date/i18n/zh-cn', {
    // in minutes
    timezoneOffset: 8 * 60,
    firstDayOfWeek: 1,
    minimalDaysInFirstWeek: 1,

    // DateFormatSymbols
    eras: ['��Ԫǰ', '��Ԫ'],
    months: ['һ��', '����', '����', '����', '����', '����',
        '����', '����', '����', 'ʮ��', 'ʮһ��', 'ʮ����'],
    shortMonths: ['һ��', '����', '����', '����', '����', '����',
        '����', '����', '����', 'ʮ��', 'ʮһ��', 'ʮ����'],
    weekdays: ['������', '����һ', '���ڶ�', '������', '������',
        '������', '������'],
    shortWeekdays: ['����', '��һ', '�ܶ�', '����', '����', '����',
        '����'],
    ampms: ['����', '����'],
    /*jshint quotmark: false*/
    datePatterns: ["yyyy'��'M'��'d'��' EEEE", "yyyy'��'M'��'d'��'", "yyyy-M-d", "yy-M-d"],
    timePatterns: ["ahh'ʱ'mm'��'ss'��' 'GMT'Z", "ahh'ʱ'mm'��'ss'��'", "H:mm:ss", "ah:mm"],
    dateTimePattern: '{date} {time}'
});
