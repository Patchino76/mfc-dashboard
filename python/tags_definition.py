mills_dict = [
    {"en" : "Mill01", "bg" : "Мелница 01"},
    {"en" : "Mill02", "bg" : "Мелница 02"}, 
    {"en" : "Mill03", "bg" : "Мелница 03"},
    {"en" : "Mill04", "bg" : "Мелница 04"},
    {"en" : "Mill05", "bg" : "Мелница 05"},
    {"en" : "Mill06", "bg" : "Мелница 06"},
    {"en" : "Mill07", "bg" : "Мелница 07"},
    {"en" : "Mill08", "bg" : "Мелница 08"},
    {"en" : "Mill09", "bg" : "Мелница 09"},
    {"en" : "Mill10", "bg" : "Мелница 10"},
    {"en" : "Mill11", "bg" : "Мелница 11"},
    {"en" : "Mill12", "bg" : "Мелница 12"},
]
__all__ = ["mills_dict"]

sql_tags = [
# ФЛОТАЦИЯ ИЗВЛИЧАНЕ
    {"id": 3287, "name" : "RECOVERY_LINE0_CU_LONG", "desc" : "Извличане ред 0" },
    {"id": 1791, "name" : "RECOVERY_LINE1_CU_LONG", "desc" : "Извличане ред 1" },
    {"id": 1792, "name" : "RECOVERY_LINE2_CU_LONG", "desc" : "Извличане ред 2" },
    {"id": 1793, "name" : "RECOVERY_LINE3_CU_LONG", "desc" : "Извличане ред 3" },
    {"id": 1794, "name" : "RECOVERY_LINE4_CU_LONG", "desc" : "Извличане ред 4" },
    {"id": 1795, "name" : "RECOVERY_LINE5_CU_LONG", "desc" : "Извличане ред 5" },
    {"id": 3288, "name" : "RECOVERY_LINEALL_CU_LONG", "desc" : "Общo извличане" },
# ФЛОТАЦИЯ ОТПАДЪК Cu
    {"id": 3285, "name" : "CUFLOTAS2-S7-400PV_CU_LINE_18", "desc" : "Отпадък Cu ред 0" },
    {"id": 1430, "name" : "CUFLOTAS2-S7-400PV_CU_LINE_1", "desc" : "Отпадък Cu ред 1" },
    {"id": 1431, "name" : "CUFLOTAS2-S7-400PV_CU_LINE_2", "desc" : "Отпадък Cu ред 2" },
    {"id": 1432, "name" : "CUFLOTAS2-S7-400PV_CU_LINE_3", "desc" : "Отпадък Cu ред 3" },
    {"id": 1433, "name" : "CUFLOTAS2-S7-400PV_CU_LINE_4", "desc" : "Отпадък Cu ред 4" },   
    {"id": 1434, "name" : "CUFLOTAS2-S7-400PV_CU_LINE_5", "desc" : "Отпадък Cu ред 5" },
    {"id": 1600, "name" : "CUFLOTAS2-S7-400PV_CU_LINE_6", "desc" : "Общ отпадък Cu" },
# ФЛОТАЦИЯ ОТПАДЪК Fe
    {"id": 3294, "name" : "CUFLOTAS2-S7-400PV_FE_LINE_18", "desc" : "Отпадък Fe ред 0" },
    {"id": 1756, "name" : "CUFLOTAS2-S7-400PV_FE_LINE1", "desc" : "Отпадък Fe ред 1" },
    {"id": 1757, "name" : "CUFLOTAS2-S7-400PV_FE_LINE2", "desc" : "Отпадък Fe ред 2" },
    {"id": 1758, "name" : "CUFLOTAS2-S7-400PV_FE_LINE3", "desc" : "Отпадък Fe ред 3" },
    {"id": 1759, "name" : "CUFLOTAS2-S7-400PV_FE_LINE4", "desc" : "Отпадък Fe ред 4" },
    {"id": 1760, "name" : "CUFLOTAS2-S7-400PV_FE_LINE5", "desc" : "Отпадък Fe ред 5" },
    {"id": 1761, "name" : "CUFLOTAS2-S7-400PV_FE_LINE6", "desc" : "Общ отпадък Fe" },
]
__all__ = ["sql_tags"]

mills_tags = {
    "shift1": [
        {"id": 562, "name": "Mill01", "desc": "Смяна 1 тотал: МА01"},
        {"id": 582, "name": "Mill02", "desc": "Смяна 1 тотал: МА02"},
        {"id": 532, "name": "Mill03", "desc": "Смяна 1 тотал: МА03"},
        {"id": 1231, "name": "Mill04", "desc": "Смяна 1 тотал: МА04"},
        {"id": 1239, "name": "Mill05", "desc": "Смяна 1 тотал: МА05"},
        {"id": 1221, "name": "Mill06", "desc": "Смяна 1 тотал: МА06"},
        {"id": 463, "name": "Mill07", "desc": "Смяна 1 тотал: МА07"},
        {"id": 503, "name": "Mill08", "desc": "Смяна 1 тотал: МА08"},
        {"id": 511, "name": "Mill09", "desc": "Смяна 1 тотал: МА09"},
        {"id": 519, "name": "Mill10", "desc": "Смяна 1 тотал: МА10"},
        {"id": 524, "name": "Mill11", "desc": "Смяна 1 тотал: МА11"},
        {"id": 3794, "name": "Mill12", "desc": "Смяна 1 тотал: МА12"},
    ],
    "shift2": [
        {"id": 563, "name": "Mill01", "desc": "Смяна 2 тотал: МА01"},
        {"id": 583, "name": "Mill02", "desc": "Смяна 2 тотал: МА02"},
        {"id": 533, "name": "Mill03", "desc": "Смяна 2 тотал: МА03"},
        {"id": 1232, "name": "Mill04", "desc": "Смяна 2 тотал: МА04"},
        {"id": 1240, "name": "Mill05", "desc": "Смяна 2 тотал: МА05"},
        {"id": 1222, "name": "Mill06", "desc": "Смяна 2 тотал: МА06"},
        {"id": 464, "name": "Mill07", "desc": "Смяна 2 тотал: МА07"},
        {"id": 504, "name": "Mill08", "desc": "Смяна 2 тотал: МА08"},
        {"id": 512, "name": "Mill09", "desc": "Смяна 2 тотал: МА09"},
        {"id": 520, "name": "Mill10", "desc": "Смяна 2 тотал: МА10"},
        {"id": 525, "name": "Mill11", "desc": "Смяна 2 тотал: МА11"},
        {"id": 3795, "name": "Mill12", "desc": "Смяна 2 тотал: МА12"},
    ],
    "shift3": [
        {"id": 564, "name": "Mill01", "desc": "Смяна 3 тотал: МА01"},
        {"id": 584, "name": "Mill02", "desc": "Смяна 3 тотал: МА02"},
        {"id": 534, "name": "Mill03", "desc": "Смяна 3 тотал: МА03"},
        {"id": 1233, "name": "Mill04", "desc": "Смяна 3 тотал: МА04"},
        {"id": 1241, "name": "Mill05", "desc": "Смяна 3 тотал: МА05"},
        {"id": 1223, "name": "Mill06", "desc": "Смяна 3 тотал: МА06"},
        {"id": 465, "name": "Mill07", "desc": "Смяна 3 тотал: МА07"},
        {"id": 505, "name": "Mill08", "desc": "Смяна 3 тотал: МА08"},
        {"id": 513, "name": "Mill09", "desc": "Смяна 3 тотал: МА09"},
        {"id": 521, "name": "Mill10", "desc": "Смяна 3 тотал: МА10"},
        {"id": 526, "name": "Mill11", "desc": "Смяна 3 тотал: МА11"},
        {"id": 3797, "name": "Mill12", "desc": "Смяна 3 тотал: МА12"},
    ],
    "total": [
        {"id": 1213, "name": "Mill01", "desc": "Общо смени: МА01"},
        {"id": 1215, "name": "Mill02", "desc": "Общо смени: МА02"},
        {"id": 1210, "name": "Mill03", "desc": "Общо смени: МА03"},
        {"id": 1245, "name": "Mill04", "desc": "Общо смени: МА04"},
        {"id": 1246, "name": "Mill05", "desc": "Общо смени: МА05"},
        {"id": 1247, "name": "Mill06", "desc": "Общо смени: МА06"},
        {"id": 1200, "name": "Mill07", "desc": "Общо смени: МА07"},
        {"id": 1202, "name": "Mill08", "desc": "Общо смени: МА08"},
        {"id": 1204, "name": "Mill09", "desc": "Общо смени: МА09"},
        {"id": 1205, "name": "Mill10", "desc": "Общо смени: МА10"},
        {"id": 1206, "name": "Mill11", "desc": "Общо смени: МА11"},
        {"id": 3819, "name": "Mill12", "desc": "Общо смени: МА12"},
    ],
    "ore": [
        {"id": 485, "name": "Mill01", "desc": "Разход на руда МА01"},
        {"id": 488, "name": "Mill02", "desc": "Разход на руда МА02"},
        {"id": 491, "name": "Mill03", "desc": "Разход на руда МА03"},
        {"id": 494, "name": "Mill04", "desc": "Разход на руда МА04"},
        {"id": 497, "name": "Mill05", "desc": "Разход на руда МА05"},
        {"id": 500, "name": "Mill06", "desc": "Разход на руда МА06"},
        {"id": 455, "name": "Mill07", "desc": "Разход на руда МА07"},
        {"id": 467, "name": "Mill08", "desc": "Разход на руда МА08"},
        {"id": 476, "name": "Mill09", "desc": "Разход на руда МА09"},
        {"id": 479, "name": "Mill10", "desc": "Разход на руда МА10"},
        {"id": 482, "name": "Mill11", "desc": "Разход на руда МА11"},
        {"id": 3786, "name": "Mill12", "desc": "Разход на руда МА12"},
    ]
}
__all__ = ["mills_tags"]




