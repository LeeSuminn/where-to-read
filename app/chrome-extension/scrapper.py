from selenium import webdriver
import time
import pandas as pd


def movepage(category: int) -> list:
    # category 는 숫자로 들어옴 ,카테고리별로 숫자 다름
    category_result = [[] for _ in range(5)]
    index = 1
    # url = https://select.ridibooks.com/categories/{100}?sort=recent&page={index} 이런 형식
    if category == 1500:
        index = 12
    if category == 500:
        index = 4
    is_lastpage = False

    while True:

        url = f"https://select.ridibooks.com/categories/{category}?sort=recent&page={index}"
        print(url)
        a_page_result, is_lastpage = get_all_info_at_a_page(url)
        save_data(a_page_result, category, index)
        category_result = merge_data(category_result, a_page_result)

        if is_lastpage == True:
            break

        index += 1

    return category_result


def go_to_next_category(categoryDic: dict):
    total_result = [[] for _ in range(5)]
    for category in categoryDic.values():
        one_category_result = movepage(category)
        one_category_result_excel = {'title_text': one_category_result[0], 'author_text': one_category_result[1],
                                     'pub_text': one_category_result[2], 'ebook_publishd_date_text': one_category_result[3], 'platform_name': one_category_result[4]}
        one_category_result_excel = pd.DataFrame(one_category_result_excel)
        one_category_result_excel.to_excel(
            excel_writer=f'{category}_result.xlsx')
        total_result = merge_data(total_result, one_category_result)
        print(category)
    return total_result


def merge_data(merged_result, added_data):
    for i in range(5):
        merged_result[i].extend(added_data[i])
    return merged_result


def save_data(one_category_result, category, page_index):
    one_category_result_excel = {'title_text': one_category_result[0], 'author_text': one_category_result[1],
                                 'pub_text': one_category_result[2], 'ebook_publishd_date_text': one_category_result[3], 'platform_name': one_category_result[4]}
    one_category_result_excel = pd.DataFrame(one_category_result_excel)
    one_category_result_excel.to_excel(
        excel_writer=f'{category}_{page_index}_result.xlsx')


args = ["PageBookDetail_BookTitle",
        "p.PageBookDetail_BookElements span",
        "section.PageBookDetail_Panel div.PageBookDetail_PanelContent"]


def get_book_info(URL, args):
    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    driver = webdriver.Chrome(
        '/Users/hoon2hooni/usr/bin/chromedriver', options=options)
    driver.get(URL)
    time.sleep(3)
    platform_name = 'ridiselect'
    while True:
        try:
            title_arg, spans_arg, ebook_publishd_date_arg = args
            title_text = driver.find_element_by_class_name(title_arg).text
            spans = driver.find_elements_by_css_selector(spans_arg)
            author_text = spans[0].text
            i = 0
            while True:
                i += 1
                if spans[i].text[0] == '·':
                    pub_text = spans[i].text
                    break
            ebook_publishd_date_text = driver.find_elements_by_css_selector(
                ebook_publishd_date_arg)[-1].text
            driver.close()
            break
        except:
            print(f"{URL} Make error here")
            driver.close()
            driver = webdriver.Chrome(
                '/Users/hoon2hooni/usr/bin/chromedriver', options=options)
            break
            get_book_info(URL, args)

    return [title_text, author_text, pub_text, ebook_publishd_date_text, platform_name]


def get_book_link_for_a_page(URL):
    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    driver = webdriver.Chrome(
        '/Users/hoon2hooni/usr/bin/chromedriver', options=options)
    driver.get(URL)
    time.sleep(3)
    book_tags = driver.find_elements_by_css_selector("a.GridBookList_ItemLink")
    book_links = [test.get_attribute("href") for test in book_tags]
    driver.close()
    return book_links


def get_all_info_at_a_page(URL):
    is_lastpage = False
    args = ["PageBookDetail_BookTitle",
            "p.PageBookDetail_BookElements span",
            "section.PageBookDetail_Panel div.PageBookDetail_PanelContent"]
    one_page_bookList = get_book_link_for_a_page(URL)
    if len(one_page_bookList) != 24:
        is_lastpage = True
    result = [[] for _ in range(5)]
    for link in one_page_bookList:
        a_book_info = get_book_info(link, args)
        print(link)
        for i in range(len(a_book_info)):
            result[i].append(a_book_info[i])

    return result, is_lastpage


categoryDic = {'건강/다이어트': 500}

# categoryDic = {'경영경제':200, '자기계발':300, '인문/사회/역사':400, '건강/다이어트':500, '가정/생활':600, '종교':700}
reversed_pair_list = sorted(
    [(value, category) for category, value in categoryDic.items()], reverse=True)
reversed_dic = {category: value for value, category in reversed_pair_list}
go_to_next_category(reversed_dic)
