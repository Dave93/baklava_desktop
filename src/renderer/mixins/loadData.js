
import { mapGetters, mapActions } from "vuex";
export default {
    computed: {
        ...mapGetters({
            webHook: "settings/webHook",
            managerData: "settings/managerData",
        })
    },
    methods: {
        ...mapActions({
            refreshData: "refreshData",
        }),
       async loadData() {
            let { data: productsData } = await this.$http.get(
                `${this.webHook}mycatalog.product.list?managerId=${this.managerData.ID}`
            );
            await this.refreshData({
                val: productsData.result.map((item) => ({
                    id: item.ID,
                    name: item.ELEMENT_NAME,
                    barcode: item.BARCODE_BARCODE,
                    customCode: item.CUSTOM_CODE,
                    selected: false,
                    categoryId: item.ELEMENT_IBLOCK_SECTION_ID,
                    image: item.PREVIEW_PICTURE,
                    price: item.BASE_PRICE,
                    type: item.type,
                    totalAmountCount: item.TOTAL_AMOUNT_COUNT,
                    childs: item.childs,
                })),
            });
        }
    }
}