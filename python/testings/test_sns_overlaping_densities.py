def get_overlapping_densities(self) -> str:
        if self.df.shape == (0, 0):
            print("No data available")
            return "No data available"

        df_new = self.df.copy()
        print("1:", df_new.head())

        df_new = df_new.reset_index()  # This moves the index to a column
        df_new.rename(columns={'index': 'timestamp'}, inplace=True)
        df_new = df_new.melt(id_vars=['timestamp'], value_vars=df_new.columns, var_name='tag', value_name='value')
        
        df_new.reset_index(drop=True, inplace=True)
        df_new.drop('timestamp', axis=1, inplace=True)
        print("2:", df_new.head())

        pal = sns.cubehelix_palette(10, rot=-.25, light=.7)
        g = sns.FacetGrid(df_new, row="tag", hue="tag", aspect=15, height=2, palette=pal)

        g.map(sns.kdeplot, "value",
        bw_adjust=.5, clip_on=False,
        fill=True, alpha=1, linewidth=1.5)
        g.map(sns.kdeplot, "value", clip_on=False, color="w", lw=2, bw_adjust=.5)   

        g.refline(y=0, linewidth=2, linestyle="-", color=None, clip_on=False)
        def label(x, color, label):
            ax = plt.gca()
            ax.text(0, .2, label, fontweight="bold", color=color,
            ha="left", va="center", transform=ax.transAxes)
        g.map(label, "value")

        g.figure.subplots_adjust(hspace=0.5)
        g.set_titles("")
        g.set(yticks=[], ylabel="")
        g.despine(bottom=True, left=True)

        plt.savefig("fig.jpg", format="jpg", dpi=300, bbox_inches='tight')
        # html = mpld3.fig_to_html(g.fig)
        # return html

        return ""   